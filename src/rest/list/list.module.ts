import { Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { List } from '../../domain/list/entities/list.entity';
import { ListController } from './list.controller';
import { ListServiceRest } from './list.service';
import { ListsServiceDomain } from '../../domain/list/services/list.service';
import { WishModule } from '../wish/wish.module';
import { MinioModule } from '../../libs/minio/minio.module';
import { RedisModule } from '../../libs/redis/redis.module';
import { ListWish } from '../../domain/list/entities/list-wish.entity';
import { CronListService } from "../../domain/list/services/cron.list.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([List]),
    TypeOrmModule.forFeature([ListWish]),
    AuthModule,
    UsersModule,
    WishModule,
    MinioModule,
    RedisModule,
    WishModule,
  ],
  controllers: [ListController],
  providers: [ListServiceRest, ListsServiceDomain, CronListService],
  exports: [ListServiceRest],
})
export class ListModule {}
