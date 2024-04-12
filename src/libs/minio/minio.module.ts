import { Module } from '@nestjs/common';
import minioConfig from '../../config/minio.config';
import { MinioService } from './services/minio.service';
import { NestMinioModule } from 'nestjs-minio';
import { RedisModule } from '../redis/redis.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    NestMinioModule.register(minioConfig),
    RedisModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
