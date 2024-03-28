import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { WishesService } from '../../domain/wish/services/wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from '../../domain/wish/entities/wish.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class WishService {
  constructor(
    private wishService: WishesService,
    private userService: UserService,
  ) {}

  async getAll() {
    return this.wishService.findAll();
  }

  async getAllByUserId(userId: number) {
    return this.wishService.findAllByUserId(userId);
  }

  async getOne(id: number) {
    return this.wishService.findOne(id);
  }

  async create(userId: number, data: CreateWishDto) {
    const wish = await this.initWish(userId, data);
    return await this.wishService.create(wish);
  }

  async delete(id: number) {
    return await this.wishService.remove(id);
  }

  async hashPassword(data: string) {
    return await bcrypt.hash(data, 5);
  }

  async initWish(userId: number, data: CreateWishDto) {
    const user = await this.findUser(userId);
    const wish: Wish = new Wish();
    if (
      !data.name ||
      !data.currency ||
      !data.price ||
      !data.url ||
      !data.description ||
      !data.photo ||
      !user
    ) {
      throw new HttpException(
        'All fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    wish.name = data.name;
    wish.currency = data.currency;
    wish.price = data.price;
    wish.url = data.url;
    wish.description = data.description;
    wish.photo = data.photo;
    wish.private = data.private;
    wish.user = user;
    return wish;
  }

  async findUser(userId: number) {
    return await this.userService.getOne(userId);
  }
}
