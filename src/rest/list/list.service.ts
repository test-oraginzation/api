import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserServiceRest } from '../user/user.service';
import { ListsService } from '../../domain/list/services/lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { List } from '../../domain/list/entities/list.entity';
import { WishService } from '../wish/wish.service';
import { User } from '../../domain/user/entities/user.entity';
import { Wish } from '../../domain/wish/entities/wish.entity';

@Injectable()
export class ListService {
  constructor(
    private listService: ListsService,
    private wishService: WishService,
    private userService: UserServiceRest,
  ) {}

  async getAll() {
    return this.listService.findAll();
  }

  async getAllByUserId(userId: number) {
    return this.listService.findAllByOwnerId(userId);
  }

  async getOneByUserID(userId: number, id: number) {
    return this.listService.findOneByOwnerId(userId, id);
  }

  async getOne(id: number) {
    return this.listService.findOne(id);
  }

  async create(userId: number, data: CreateListDto) {
    console.log(data);
    console.log(data.wishesIds);
    if (!data.wishesIds) {
      const list = await this.initList(userId, data);
      return await this.listService.create(list);
    }
    const res = await this.checkWishes(data.wishesIds, userId);
    if (res === true) {
      const list = await this.initList(userId, data);
      return await this.listService.create(list);
    }
  }

  async delete(id: number) {
    return await this.listService.remove(id);
  }

  async initList(userId: number, data: CreateListDto) {
    const wishes: Wish[] = [];
    const owner: User = await this.findUser(userId);
    const list: List = new List();
    if (!data.name || !data.description || !owner) {
      throw new HttpException(
        'All fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (data.wishesIds) {
      for (let i = 0; i < data.wishesIds.length; i++) {
        const wish = await this.wishService.getOne(data.wishesIds[i]);
        wishes.push(wish);
      }
    }

    list.name = data.name;
    list.description = data.description;
    list.photo = data.photo;
    list.private = data.private;
    list.owner = owner;
    list.wishes = wishes;
    return list;
  }

  async findUser(userId: number) {
    return await this.userService.getOne(userId);
  }

  async checkWishes(ids: number[], userId: number): Promise<boolean> {
    for (let i = 0; i < ids.length; i++) {
      const res = await this.wishService.checkUserWish(ids[i], userId);
      if (res === false) {
        throw new HttpException(
          `User doesn't have the wish with id ${ids[i]}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return true;
  }
}
