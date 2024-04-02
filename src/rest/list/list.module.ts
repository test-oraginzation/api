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

@Module({
  imports: [
    TypeOrmModule.forFeature([List]),
    AuthModule,
    UsersModule,
    WishModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [ListController],
  providers: [ListServiceRest, ListsServiceDomain],
  exports: [ListServiceRest],
})
export class ListModule {}
