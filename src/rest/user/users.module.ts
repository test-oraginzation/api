import { Module } from '@nestjs/common';
import { UsersService } from '../../domain/user/services/user.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/user/entities/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserService],
  exports: [UserService],
})
export class UsersModule {}
