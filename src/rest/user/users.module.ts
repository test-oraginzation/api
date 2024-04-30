import { forwardRef, Module } from '@nestjs/common';
import { UserServiceDomain } from '../../domain/user/services/user.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/user/entities/user.entity';
import { UserServiceRest } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { MinioModule } from '../../libs/minio/minio.module';
import { RedisModule } from '../../libs/redis/redis.module';
import { UserListWishServiceDomain } from '../../domain/list/services/list-wish.service';
import { ListWish } from '../../domain/list/entities/list-wish.entity';
import { WishModule } from '../wish/wish.module';
import { FollowModule } from '../follow/follow.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => WishModule),
    forwardRef(() => FollowModule),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([ListWish]),
    MinioModule,
    RedisModule,
  ],
  controllers: [UsersController],
  providers: [UserServiceDomain, UserServiceRest, UserListWishServiceDomain],
  exports: [UserListWishServiceDomain, UserServiceDomain, UserServiceRest],
})
export class UsersModule {}
