import { Module } from '@nestjs/common';
import minioConfig from '../../config/minio.config';
import { MinioService } from './services/minio.service';
import { NestMinioModule } from 'nestjs-minio';
import { MinioController } from './minio.controller';
import { AuthModule } from '../../rest/auth/auth.module';
import { RedisModule } from '../redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../rest/user/users.module';

@Module({
  imports: [
    NestMinioModule.register(minioConfig),
    AuthModule,
    RedisModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [MinioController],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
