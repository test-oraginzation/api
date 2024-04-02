import { forwardRef, Module } from '@nestjs/common';
import { UserServiceDomain } from '../../domain/user/services/user.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/user/entities/user.entity';
import { UserServiceRest } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MinioModule } from '../../libs/minio/minio.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MinioModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UserServiceDomain, UserServiceRest],
  exports: [UserServiceRest],
})
export class UsersModule {}
