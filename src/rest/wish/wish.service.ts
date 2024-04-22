import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WishServiceDomain } from '../../domain/wish/services/wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from '../../domain/wish/entities/wish.entity';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { MinioService } from '../../libs/minio/services/minio.service';
import { RedisService } from '../../libs/redis/services/redis.service';
import { UserServiceDomain } from '../../domain/user/services/user.service';

@Injectable()
export class WishServiceRest {
  constructor(
    private readonly wishServiceDomain: WishServiceDomain,
    private readonly userServiceDomain: UserServiceDomain,
    private readonly minioService: MinioService,
    private readonly redisService: RedisService,
  ) {}

  async getAll() {
    return this.wishServiceDomain.findAll();
  }

  async getAllByUserId(userId: number) {
    const wishes: Wish[] = await this.wishServiceDomain.findAllByUserId(userId);
    if (!wishes) {
      throw new HttpException('Wishes not found', HttpStatus.NOT_FOUND);
    }
    console.log(`user ${userId} get wishes`);
    return wishes;
  }

  async getOneByUserID(userId: number, id: number) {
    const wish = await this.wishServiceDomain.findOneByUserId(userId, id);
    if (!wish) {
      throw new HttpException('Wish not found', HttpStatus.NOT_FOUND);
    }
    return wish;
  }

  async create(userId: number, data: CreateWishDto) {
    if (!data) {
      throw new HttpException('Send data to create', HttpStatus.BAD_REQUEST);
    }
    const wish = await this.initWish(userId, data);
    return await this.wishServiceDomain.create(wish);
  }

  async delete(id: number) {
    const wish: Wish = await this.wishServiceDomain.findOne(id);
    if (!wish) {
      throw new HttpException('Wish not found', HttpStatus.NOT_FOUND);
    }
    return await this.wishServiceDomain.remove(id);
  }

  async updatePhoto(wishId: number) {
    const wish: Wish = await this.wishServiceDomain.findOne(wishId);
    if (!wish) {
      throw new HttpException('Wish not found', HttpStatus.NOT_FOUND);
    }
    console.log(wish);
    const url = await this.minioService.getPhoto(
      await this.redisService.getWishPhotoName(wishId),
    );
    return await this.update(wishId, { photo: url });
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
    return await this.userServiceDomain.findOne(userId);
  }

  async update(id: number, data: UpdateUserDto) {
    const wish = await this.wishServiceDomain.findOne(id);
    if (!wish) {
      throw new HttpException('Wish not found', HttpStatus.NOT_FOUND);
    }
    if (!data) {
      throw new HttpException('Send data to update', HttpStatus.BAD_REQUEST);
    }
    const updatedWish = { ...wish, ...data };
    return await this.wishServiceDomain.update(updatedWish);
  }
}
