import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowController } from './follow.controller';
import { FollowServiceDomain } from '../../domain/follow/services/follow.service';
import { FollowServiceRest } from './follow.service';
import { Module } from '@nestjs/common';
import { Follow } from '../../domain/follow/entities/follow.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    TypeOrmModule.forFeature([Follow]),
  ],
  controllers: [FollowController],
  providers: [FollowServiceDomain, FollowServiceRest],
  exports: [FollowServiceRest],
})
export class FollowModule {}
