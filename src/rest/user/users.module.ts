import { forwardRef, Module } from '@nestjs/common';
import { UserServiceDomain } from '../../domain/user/services/user.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/user/entities/user.entity';
import { UserServiceRest } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { MinioModule } from '../../libs/minio/minio.module';
import { RedisModule } from '../../libs/redis/redis.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    MinioModule,
    RedisModule,
  ],
  controllers: [UsersController],
  providers: [UserServiceDomain, UserServiceRest],
  exports: [UserServiceRest],
})
export class UsersModule {}
