import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client } from 'minio';
import * as process from 'process';
import { RedisService } from '../../redis/services/redis.service';
import { LoggerService, LogLevel } from '../../../shared/logger/logger.service';

@Injectable()
export class MinioService {
  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: Client,
    private redisService: RedisService,
    private readonly logger: LoggerService,
  ) {}

  async getPresignedUserPhoto(userId: number, name: string) {
    if (!name) {
      throw new HttpException(
        'Error: Send a file name!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const url: string = await this.minioClient.presignedPutObject(
      process.env.MINIO_BUCKET,
      `${name}`,
    );
    console.log(name);
    await this.redisService.cacheUserPhotoNameData(userId, name);
    await this.logger.log('get presigned url to upload photo', userId, LogLevel.INFO);
    return { url: url };
  }

  async getPresignedWishPhoto(wishId: number, name: string) {
    if (!name) {
      throw new HttpException(
        'Error: Send a file name!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const url: string = await this.minioClient.presignedPutObject(
      process.env.MINIO_BUCKET,
      `${name}`,
    );
    console.log(name);
    await this.redisService.cacheWishPhotoNameData(wishId, name);

    return { url: url };
  }

  async getPresignedListPhoto(listId: number, name: string) {
    if (!name) {
      throw new HttpException(
        'Error: Send a file name!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const url: string = await this.minioClient.presignedPutObject(
      process.env.MINIO_BUCKET,
      `${name}`,
    );
    console.log(name);
    await this.redisService.cacheListPhotoNameData(listId, name);

    return { url: url };
  }

  async getPhoto(name: string) {
    return await this.minioClient.presignedGetObject(
      process.env.MINIO_BUCKET,
      name,
    );
  }
}
