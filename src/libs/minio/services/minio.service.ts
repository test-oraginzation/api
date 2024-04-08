import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client } from 'minio';
import * as process from 'process';

@Injectable()
export class MinioService {
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) {}

  async getPresignedUrl(name: string) {
    return this.minioClient.presignedPutObject(
      process.env.MINIO_BUCKET || 'wishlist',
      name,
    );
  }

  async getPhoto(photoName: string) {
    console.log(photoName);
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
