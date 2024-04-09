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
    const user = this.redisService.getData(`user:${id}`);
    if (!user) {
      const user = this.userServiceDomain.findOne(id);
      if (user) {
        await this.redisService.cacheData(`user:${id}`, user);
      }
      return user;
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
    console.log(data);
    const candidate = await this.userServiceDomain.findByEmail(data.email);
    console.log(`candidate here`);
    if (candidate !== null) {
      throw new HttpException(
        'User with this email exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    data.password = await this.hashPassword(data.password);
    const user: User = await this.initUser(data);
    return await this.userServiceDomain.create(user);
  }

  async delete(id: number) {
    try {
      await this.redisService.deleteData(`user:${id}`);
    } catch (e) {
      console.log(e);
    }
    return await this.userServiceDomain.remove(id);
  }

  async search(query: string) {
    const searchUserResult = this.redisService.getData(`searchUser:${query}`);
    if (!searchUserResult) {
      const result = await this.userServiceDomain.search(query);
      await this.redisService.cacheData(`searchUser:${query}`, result);
      return result;
    }
    return searchUserResult;
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
    const user = await this.userServiceDomain.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const updateUserPayload = { ...user, ...data };
    const cachedUser = this.redisService.getData(`user:${id}`);
    if (cachedUser) {
      await this.redisService.deleteData(`user:${id}`);
    }
    const updatedUser = await this.userServiceDomain.update(updateUserPayload);
    await this.redisService.cacheData(`user:${id}`, updatedUser);
    return updatedUser;
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
