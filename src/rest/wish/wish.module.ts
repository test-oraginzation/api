import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishController } from './wish.controller';
import { WishServiceRest } from './wish.service';
import { WishServiceDomain } from '../../domain/wish/services/wish.service';
import { Wish } from '../../domain/wish/entities/wish.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { MinioModule } from '../../libs/minio/minio.module';
import { RedisModule } from '../../libs/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    AuthModule,
    UsersModule,
    MinioModule,
    RedisModule,
  ],
  controllers: [WishController],
  providers: [WishServiceDomain, WishServiceRest],
  exports: [WishServiceRest],
})
export class WishModule {}
