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

  async getPresignedUrl(userId: number, name: string) {
    const url: string = await this.minioClient.presignedPutObject(
      process.env.MINIO_BUCKET || 'wishlist',
      `${userId}:${name}`,
    );
    await this.redisService.cacheData(`user-photo:${userId}`, url);
    return url;
  }

  async getPhoto(photoName: string) {
    try {
      return await this.minioClient.presignedGetObject(
        process.env.MINIO_BUCKET || 'wishlist',
        photoName,
      );
    } catch (e) {
      console.log(e);
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }
  }

  async updatePhoto(photoName: string): Promise<string> {
    try {
      return await this.minioClient.presignedPutObject(
        process.env.MINIO_BUCKET || 'wishlist',
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
