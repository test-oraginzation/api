import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserServiceDomain } from '../../domain/user/services/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../../domain/user/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from '../../libs/redis/services/redis.service';

@Injectable()
export class UserServiceRest {
  constructor(
    private userServiceDomain: UserServiceDomain,
    private redisService: RedisService,
  ) {}

  async getAll() {
    return this.userServiceDomain.findAll();
  }

  async getOne(id: number) {
    const photo = await this.redisService.getData(`user-photo:${id}`);
    if (photo) {
      const data: UpdateUserDto = {
        photo: photo,
      };
      await this.update(id, data);
    }
    const user = this.userServiceDomain.findOne(id);
    if (!user) {
      throw new HttpException('User not exists', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByNickname(nickname: string) {
    const user = this.redisService.getData(`user:${nickname}`);
    if (!user) {
      const user = this.userServiceDomain.findByNickname(nickname);
      if (user) {
        await this.redisService.cacheData(`user:${nickname}`, user);
      }
      return user;
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.redisService.getData(`user:${email}`);
    if (!user) {
      const user = await this.userServiceDomain.findByEmail(email);
      if (user) {
        await this.redisService.cacheData(`user:${email}`, user);
      }
      return user;
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const candidate = await this.userServiceDomain.findByEmail(data.email);
    if (candidate !== null) {
      if (candidate.nickname === data.nickname) {
        console.log('error, user with this nickname exists');
        throw new HttpException(
          'User with this nickname exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log('error, user with this email exists');
      throw new HttpException(
        'User with this email exists',
        HttpStatus.BAD_REQUEST,
      );
    }
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
  }

  async search(query: string) {
    return await this.userServiceDomain.search(query);
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

  async initUser(data: CreateUserDto) {
    const user: User = new User();
    if (!data.email || !data.country || !data.password) {
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
