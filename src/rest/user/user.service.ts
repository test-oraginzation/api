import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserServiceDomain } from '../../domain/user/services/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../../domain/user/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { MinioService } from '../../libs/minio/services/minio.service';
import { RedisService } from '../../libs/redis/services/redis.service';
import { LoggerService, LogLevel } from '../../shared/logger/logger.service';
import { IPagination } from '../../shared/pagination.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SORT_TYPE } from '../../shared/sort.enum';

@Injectable()
export class UserServiceRest {
  constructor(
    private readonly userServiceDomain: UserServiceDomain,
    private readonly minioService: MinioService,
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll(params: IPagination) {
    const query = this.userRepository.createQueryBuilder('user');

    if (params.search) {
      query.where('LOWER(user.nickname) LIKE LOWER(:searchString)', {
        searchString: `%${params.search.toLowerCase()}%`,
      });
    }
    if (params.limit) {
      query.take(params.limit);
    }
    if (params.sort) {
      query.orderBy('user.nickname', params.sort as SORT_TYPE);
    }

    const users = await query.getMany();
    return {
      count: users.length,
      items: users,
    };
  }

  async getOne(id: number) {
    const user = await this.userServiceDomain.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByNickname(nickname: string) {
    const user = await this.userServiceDomain.findByNickname(nickname);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userServiceDomain.findByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    data.password = await this.hashPassword(data.password);
    const user: User = <User>{ ...data };
    console.log('user created', user.nickname);
    const createdUser = await this.userServiceDomain.create(user);
    await this.logger.log('account created', createdUser.id, LogLevel.INFO);
    return createdUser;
  }

  async delete(id: number) {
    const res = await this.userServiceDomain.remove(id);
    if (!res) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return `User with id: ${id} successfully deleted`;
  }
  async updatePassword(userId: number, password: string) {
    const user = await this.userServiceDomain.findOne(userId);
    if (!user) {
      throw new HttpException(
        `User with this id not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    user.password = await this.hashPassword(password);
    await this.logger.log('password changed', userId, LogLevel.INFO);
    return await this.userServiceDomain.update(user);
  }

  async update(id: number, data: UpdateUserDto) {
    if (!data) {
      await this.logger.log('send some data to update', id, LogLevel.ERROR);
      throw new HttpException(
        'Send some data to update',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userServiceDomain.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const updateUserPayload = { ...user, ...data };
    await this.logger.log('user updated', id, LogLevel.INFO);
    return await this.userServiceDomain.update(updateUserPayload);
  }

  async updatePhoto(userId: number) {
    const url = await this.minioService.getPhoto(
      await this.redisService.getUserPhotoName(userId),
    );
    await this.logger.log('photo updated', userId, LogLevel.INFO);
    return await this.update(userId, { photo: url });
  }

  async getLogs(userId: number) {
    return await this.logger.getLogsByUserId(userId);
  }

  private async hashPassword(data: string) {
    return await bcrypt.hash(data, 5);
  }
}
