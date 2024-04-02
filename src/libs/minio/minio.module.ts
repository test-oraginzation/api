import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '../../config/database.config';
import minioConfig from '../../config/minio.config';
import { MinioService } from './services/minio.service';
import { NestMinioModule } from 'nestjs-minio';
import { MinioController } from "./minio.controller";

@Module({
  imports: [
    NestMinioModule.register(minioConfig),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
      entities: databaseConfig.entities,
      synchronize: databaseConfig.synchronize,
      autoLoadEntities: databaseConfig.autoLoadEntities,
    }),
  ],
  controllers: [MinioController],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
