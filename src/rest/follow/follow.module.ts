import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowController } from './follow.controller';
import { FollowServiceDomain } from '../../domain/follow/services/follow.service';
import { FollowServiceRest } from './follow.service';
import { forwardRef, Module } from '@nestjs/common';
import { Follow } from '../../domain/follow/entities/follow.entity';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([Follow]),
  ],
  controllers: [FollowController],
  providers: [FollowServiceDomain, FollowServiceRest],
  exports: [FollowServiceRest],
})
export class FollowModule {}
