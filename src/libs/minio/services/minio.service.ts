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
    private userService: UserServiceRest,
  ) {}

  async getPresignedUrl(userId: number, name: string) {
    const url: string = await this.minioClient.presignedPutObject(
      process.env.MINIO_BUCKET,
      `${name}`,
    );
    console.log(name);
    const savedData = await this.redisService.cachePhotoNameData(userId, name);
    console.log(`saved data:`, savedData);
    return url;
  }

  async finishUpload(userId: number) {
    const data: string = await this.redisService.getPhotoNameData(userId);
    console.log(`data in finish upload: ${data}`);
    if (!data) {
      throw new HttpException('Failed to Upload', HttpStatus.BAD_REQUEST);
    }
    const url = await this.minioClient.getObject('wishlist', data);
    console.log(url);
    return 'success';
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
