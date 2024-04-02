import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishController } from './wish.controller';
import { WishServiceRest } from './wish.service';
import { WishServiceDomain } from '../../domain/wish/services/wish.service';
import { Wish } from '../../domain/wish/entities/wish.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../user/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    AuthModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [WishController],
  providers: [WishServiceDomain, WishServiceRest],
  exports: [WishServiceRest],
})
export class WishModule {}
