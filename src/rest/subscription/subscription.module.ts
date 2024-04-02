import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../../domain/subscription/entities/subscription.entity';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionServiceDomain } from '../../domain/subscription/services/subscription.service';
import { SubscriptionServiceRest } from './subscription.service';
import { Module } from '@nestjs/common';

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
    TypeOrmModule.forFeature([Subscription]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionServiceDomain, SubscriptionServiceRest],
  exports: [SubscriptionServiceRest],
})
export class SubscriptionModule {}
