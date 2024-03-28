import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishController } from './wish.controller';
import { WishService } from './wish.service';
import { WishesService } from '../../domain/wish/services/wish.service';
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
  providers: [WishService, WishesService],
  exports: [WishService],
})
export class WishModule {}
