import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WishServiceDomain } from '../../domain/wish/services/wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from '../../domain/wish/entities/wish.entity';
import { UserServiceRest } from '../user/user.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { MinioService } from '../../libs/minio/services/minio.service';
import { RedisService } from '../../libs/redis/services/redis.service';

@Injectable()
export class WishServiceRest {
  constructor(
    private readonly wishServiceDomain: WishServiceDomain,
    private readonly userServiceRest: UserServiceRest,
    private readonly minioService: MinioService,
    private readonly redisService: RedisService,
  ) {}

  async getAll() {
    return this.wishServiceDomain.findAll();
  }

  async getAllByUserId(userId: number) {
    const candidate = this.userServiceRest.getOne(userId);
    if (!candidate) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    return await this.wishServiceDomain.findAllByUserId(userId);
  }

  async getOneByUserID(userId: number, id: number) {
    const candidate = this.userServiceRest.getOne(userId);
    if (!candidate) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    return this.wishServiceDomain.findOneByUserId(userId, id);
  }

  async getOne(id: number) {
    return this.wishServiceDomain.findOne(id);
  }

  async create(userId: number, data: CreateWishDto) {
    if (!data) {
      throw new HttpException('Send data to create', HttpStatus.BAD_REQUEST);
    }
    const wish = await this.initWish(userId, data);
    return await this.wishServiceDomain.create(wish);
  }

  async delete(userId: number, id: number) {
    const candidate = this.userServiceRest.getOne(userId);
    if (!candidate) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    const wish: Wish = await this.wishServiceDomain.findOne(id);
    if (wish.user.id !== userId) {
      throw new HttpException('Wish not yours', HttpStatus.BAD_REQUEST);
    }
    return await this.wishServiceDomain.remove(id);
  }

  async updatePhoto(userId: number, wishId: number) {
    const candidate = this.userServiceRest.getOne(userId);
    if (!candidate) {
      throw new HttpException(`User doesn't exist`, HttpStatus.BAD_REQUEST);
    }
    const wish: Wish = await this.wishServiceDomain.findOne(wishId);
    if (!wish) {
      throw new HttpException('Wish not found', HttpStatus.NOT_FOUND);
    }
    console.log(wish);
    const url = await this.minioService.getPhoto(
      await this.redisService.getWishPhotoName(wishId),
    );
    return await this.update(userId, wishId, { photo: url });
  }

  async search(query: string) {
    if (!query) {
      throw new HttpException('Send data to search', HttpStatus.BAD_REQUEST);
    }
    return await this.wishServiceDomain.search(query);
  }

  private async initWish(userId: number, data: CreateWishDto) {
    const user = await this.findUser(userId);
    const wish: Wish = new Wish();
    if (!data.name || !data.currency || !data.price || !user) {
      throw new HttpException(
        'All fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    wish.name = data.name;
    wish.currency = data.currency;
    wish.price = data.price;
    wish.url = data.url;
    wish.description = data.description;
    wish.photo = data.photo;
    wish.private = data.private;
    wish.user = user;
    return wish;
  }

  private async findUser(userId: number) {
    return await this.userServiceRest.getOne(userId);
  }

  async checkUserWish(wishId: number, userId: number) {
    console.log(wishId, userId);
    const wish: Wish = await this.wishServiceDomain.findOne(wishId);
    console.log(wish);
    if (wish) {
      return true;
    } else {
      throw new HttpException(
        'Wish with this id NOT FOUND',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(userId: number, id: number, data: UpdateUserDto) {
    const candidate = this.userServiceRest.getOne(userId);
    if (!candidate) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    const wish = await this.wishServiceDomain.findOne(id);
    if (!wish) {
      throw new HttpException('Wish not found', HttpStatus.NOT_FOUND);
    }
    const updatedWish = { ...wish, ...data };
    return await this.wishServiceDomain.update(updatedWish);
  }
}
