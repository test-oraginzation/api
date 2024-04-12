import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client } from 'minio';
import * as process from 'process';
import { RedisService } from '../../redis/services/redis.service';
import { UserServiceRest } from '../../../rest/user/user.service';

@Injectable()
export class MinioService {
  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: Client,
    private redisService: RedisService,
    private userServiceRest: UserServiceRest,
  ) {}

  async getPresignedUrl(userId: number, name: string) {
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
    await this.redisService.deletePhotoNameData(userId);
    const savedData = await this.redisService.cachePhotoNameData(userId, name);
    console.log(`saved data:`, savedData);
    return { url: url };
  }

  async finishUpload(userId: number) {
    console.log('wanna finish upload:', userId);
    const data: string = await this.redisService.getPhotoNameData(userId);
    console.log(`data in finish upload: ${data}`);
    if (!data) {
      throw new HttpException('Failed to Upload', HttpStatus.BAD_REQUEST);
    }
    const url = await this.minioClient.presignedGetObject('wishlist', data);
    return await this.userServiceRest.update(userId, {
      photo: url,
    });
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
