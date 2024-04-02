import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WishesService } from '../../domain/wish/services/wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from '../../domain/wish/entities/wish.entity';
import { UserServiceRest } from '../user/user.service';

@Injectable()
export class WishService {
  constructor(
    private wishService: WishesService,
    private userService: UserServiceRest,
  ) {}

  async getAll() {
    return this.wishService.findAll();
  }

  async getAllByUserId(userId: number) {
    return this.wishService.findAllByUserId(userId);
  }

  async getOneByUserID(userId: number, id: number) {
    return this.wishService.findOneByUserId(userId, id);
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

  private async initWish(userId: number, data: CreateWishDto) {
    const user = await this.findUser(userId);
    const wish: Wish = new Wish();
    if (
      !data.name ||
      !data.currency ||
      !data.price ||
      !data.url ||
      !data.description ||
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

  private async findUser(userId: number) {
    return await this.userService.getOne(userId);
  }

  async checkUserWish(wishId: number, userId: number) {
    console.log(wishId, userId);
    const wish: Wish = await this.wishService.findOne(wishId);
    console.log(wish);
    if (wish) {
      return true;
    } else {
      throw new HttpException(
        'Wish with this id NOT FOUND',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
