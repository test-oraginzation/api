import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WishServiceDomain } from '../../domain/wish/services/wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from '../../domain/wish/entities/wish.entity';
import { MinioService } from '../../libs/minio/services/minio.service';
import { RedisService } from '../../libs/redis/services/redis.service';
import { LoggerService, LogLevel } from '../../shared/logger/logger.service';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../../domain/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPagination } from '../../shared/pagination/pagination.interface';
import { applyPaginationParams } from '../../shared/pagination/pagination.utils';
import { CountItemsDto } from '../../shared/count-items.dto';

@Injectable()
export class WishServiceRest {
  constructor(
    private readonly wishServiceDomain: WishServiceDomain,
    private readonly minioService: MinioService,
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
  ) {}

  async getAll() {
    return this.wishServiceDomain.findAll();
  }

  async getAllByUserId(userId: number, params: IPagination) {
    const query = this.wishRepository
      .createQueryBuilder('wish')
      .where('wish.user.id = :userId', { userId });
    if (params.search) {
      query.andWhere('LOWER(wish.name) LIKE LOWER(:query)', {
        query: `%${params.search.toLowerCase()}%`,
      });
    }
    applyPaginationParams(query, params, 'wish.updatedDate');
    const wishes = await query.getMany();
    return {
      count: wishes.length,
      items: wishes,
    } as CountItemsDto;
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
    const wish = <Wish>{ ...data, user: { id: userId } as User };
    const createdWish: Wish = await this.wishServiceDomain.create(wish);
    await this.logger.log(
      `wish:${createdWish.id} created`,
      userId,
      LogLevel.INFO,
    );
    return createdWish;
  }

  async delete(userId: number, id: number) {
    const wish: Wish = await this.wishServiceDomain.findOne(id);
    if (!wish) {
      throw new HttpException('Wish not found', HttpStatus.NOT_FOUND);
    }
    await this.logger.log(`wish:${id} deleted`, userId, LogLevel.INFO);
    return await this.wishServiceDomain.remove(id);
  }

  async updatePhoto(userId: number, wishId: number) {
    const wish: Wish = await this.wishServiceDomain.findOne(wishId);
    if (!wish) {
      throw new HttpException('Wish not found', HttpStatus.NOT_FOUND);
    }
    const url = await this.minioService.getPhoto(
      await this.redisService.getWishPhotoName(wishId),
    );
    await this.logger.log(
      `wish:${wishId} photo updated`,
      userId,
      LogLevel.INFO,
    );
    return await this.update(userId, wishId, { photo: url });
  }

  async update(userId: number, id: number, data: UpdateWishDto) {
    const wish = await this.wishServiceDomain.findOne(id);
    if (!wish) {
      throw new HttpException('Wish not found', HttpStatus.NOT_FOUND);
    }
    if (!data) {
      throw new HttpException('Send data to update', HttpStatus.BAD_REQUEST);
    }
    const updatedWish = { ...wish, ...data };
    await this.logger.log(`wish:${id} updated`, userId, LogLevel.INFO);
    return await this.wishServiceDomain.update(updatedWish);
  }
}
