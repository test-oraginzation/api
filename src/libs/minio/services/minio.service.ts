import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client } from 'minio';
import * as process from 'process';
import { RedisService } from '../../redis/services/redis.service';

@Injectable()
export class MinioService {
  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: Client,
    private redisService: RedisService,
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

  async updatePhoto(photoName: string): Promise<string> {
    try {
      return await this.minioClient.presignedPutObject(
        process.env.MINIO_BUCKET,
        photoName,
      );
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Error generating presigned URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
