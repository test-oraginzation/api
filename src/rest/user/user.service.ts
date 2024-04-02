import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserServiceDomain } from '../../domain/user/services/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../../domain/user/entities/user.entity';
import { MinioService } from '../../libs/minio/services/minio.service';
@Injectable()
export class UserServiceRest {
  constructor(
    private usersService: UserServiceDomain,
    private minioService: MinioService,
  ) {}

  async getAll() {
    return this.usersService.findAll();
  }

  async getOne(id: number) {
    return this.usersService.findOne(id);
  }

  async findByNickname(nickname: string) {
    return await this.usersService.findByNickname(nickname);
  }

  async create(data: CreateUserDto) {
    console.log(data);
    const candidate = await this.usersService.findByEmail(data.email);
    console.log(`candidate here`);
    if (candidate !== null) {
      throw new HttpException(
        'User with this email exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    data.password = await this.hashPassword(data.password);
    const user: User = await this.initUser(data);
    return await this.usersService.create(user);
  }

  async delete(id: number) {
    return await this.usersService.remove(id);
  }

  async hashPassword(data: string) {
    return await bcrypt.hash(data, 5);
  }

  async initUser(data: CreateUserDto) {
    const user: User = new User();
    if (
      !data.nickname ||
      !data.email ||
      !data.country ||
      !data.birthday ||
      !data.gender ||
      !data.phone ||
      !data.surname ||
      !data.name ||
      !data.password
    ) {
      throw new HttpException(
        'All fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (data.photo) {
      const url = await this.minioService.getPhoto(data.photo);
      user.photo = url;
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
