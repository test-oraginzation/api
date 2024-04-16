import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserServiceDomain } from '../../domain/user/services/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../../domain/user/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { MinioService } from '../../libs/minio/services/minio.service';
import { RedisService } from '../../libs/redis/services/redis.service';

@Injectable()
export class UserServiceRest {
  constructor(
    private readonly userServiceDomain: UserServiceDomain,
    private readonly minioService: MinioService,
    private readonly redisService: RedisService,
  ) {}

  async getAll() {
    return this.userServiceDomain.findAll();
  }

  async getOne(id: number) {
    console.log(id);
    const user = this.userServiceDomain.findOne(id);
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
    const user: User = await this.initUser(data);
    console.log('user created', user.nickname);
    return await this.userServiceDomain.create(user);
  }

  async delete(id: number) {
    const res = await this.userServiceDomain.remove(id);
    if (!res) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return `User with id: ${id} successfully deleted`;
  }

  async search(query: string) {
    const users: User[] = await this.userServiceDomain.search(query);
    if (!users) {
      throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
    }
    return users;
  }

  async hashPassword(data: string) {
    return await bcrypt.hash(data, 5);
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
    return await this.userServiceDomain.update(user);
  }

  async update(id: number, data: UpdateUserDto) {
    if (!data) {
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
    return await this.userServiceDomain.update(updateUserPayload);
  }

  async updatePhoto(userId: number) {
    const url = await this.minioService.getPhoto(
      await this.redisService.getUserPhotoName(userId),
    );
    return await this.update(userId, { photo: url });
  }

  async initUser(data: CreateUserDto) {
    const user: User = new User();
    if (!data.email || !data.country || !data.password || !data.password) {
      throw new HttpException(
        'All fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (data.photo) {
      user.photo = data.photo;
    }
    user.nickname = data.nickname;
    user.email = data.email;
    user.country = data.country;
    user.birthday = data.birthday;
    user.gender = data.gender;
    user.phone = data.phone;
    user.surname = data.surname;
    user.name = data.name;
    user.password = data.password;
    return user;
  }
}
