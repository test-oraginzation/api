import { Module } from '@nestjs/common';
import minioConfig from '../../config/minio.config';
import { MinioService } from './services/minio.service';
import { NestMinioModule } from 'nestjs-minio';
import { MinioController } from './minio.controller';

@Module({
  imports: [NestMinioModule.register(minioConfig)],
  controllers: [MinioController],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
