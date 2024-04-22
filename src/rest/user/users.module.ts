import { forwardRef, Module } from '@nestjs/common';
import { UserServiceDomain } from '../../domain/user/services/user.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/user/entities/user.entity';
import { UserServiceRest } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { MinioModule } from '../../libs/minio/minio.module';
import { RedisModule } from '../../libs/redis/redis.module';
import { UserListWishServiceDomain } from '../../domain/user/services/user-list-wish.service';
import { UserListWish } from '../../domain/user/entities/user-list-wish.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserListWish]),
    MinioModule,
    RedisModule,
  ],
  controllers: [UsersController],
  providers: [UserServiceDomain, UserServiceRest, UserListWishServiceDomain],
  exports: [UserListWishServiceDomain, UserServiceDomain, UserServiceRest],
})
export class UsersModule {}
