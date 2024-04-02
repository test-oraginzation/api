import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserServiceDomain } from '../../domain/user/services/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../../domain/user/entities/user.entity';
import { MinioService } from '../../libs/minio/services/minio.service';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserServiceRest {
  constructor(
    private userServiceDomain: UserServiceDomain,
    private minioService: MinioService,
  ) {}

  async getAll() {
    return this.userServiceDomain.findAll();
  }

  async getOne(id: number) {
    return this.userServiceDomain.findOne(id);
  }

  async findByNickname(nickname: string) {
    return await this.userServiceDomain.findByNickname(nickname);
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
    return await this.userServiceDomain.remove(id);
  }

  async hashPassword(data: string) {
    return await bcrypt.hash(data, 5);
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.userServiceDomain.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const updatedUser = { ...user, ...data };
    return await this.userServiceDomain.update(updatedUser);
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
