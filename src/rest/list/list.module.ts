import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { List } from '../../domain/list/entities/list.entity';
import { ListController } from './list.controller';
import { ListServiceRest } from './list.service';
import { ListsServiceDomain } from '../../domain/list/services/lists.service';
import { WishModule } from '../wish/wish.module';
import { UserListWishServiceDomain } from '../../domain/user-list-wish/services/user-list-wish.service';
import { UserListWish } from '../../domain/user-list-wish/entities/user-list-wish.entity';
import { MinioModule } from '../../libs/minio/minio.module';
import { RedisModule } from '../../libs/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([List]),
    TypeOrmModule.forFeature([UserListWish]),
    AuthModule,
    UsersModule,
    WishModule,
    MinioModule,
    RedisModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [ListController],
  providers: [ListServiceRest, ListsServiceDomain, UserListWishServiceDomain],
  exports: [ListServiceRest],
})
export class ListModule {}
