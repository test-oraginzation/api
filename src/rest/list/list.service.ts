import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserServiceRest } from '../user/user.service';
import { ListsServiceDomain } from '../../domain/list/services/lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { List } from '../../domain/list/entities/list.entity';
import { User } from '../../domain/user/entities/user.entity';
import { Wish } from '../../domain/wish/entities/wish.entity';
import { UpdateListDto } from './dto/update-list.dto';
import { WishServiceRest } from '../wish/wish.service';

@Injectable()
export class ListServiceRest {
  constructor(
    private listServiceDomain: ListsServiceDomain,
    private wishServiceRest: WishServiceRest,
    private userServiceRest: UserServiceRest,
  ) {}

  async getAll() {
    return this.listServiceDomain.findAll();
  }

  async getAllByUserId(userId: number) {
    const user = this.userServiceRest.getOne(userId);
    if (!user) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    return this.listServiceDomain.findAllByOwnerId(userId);
  }

  async getOneByUserID(userId: number, id: number) {
    const user = this.userServiceRest.getOne(userId);
    if (!user) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    return this.listServiceDomain.findOneByOwnerId(userId, id);
  }

  async getOne(id: number) {
    return this.listServiceDomain.findOne(id);
  }

  async create(userId: number, data: CreateListDto) {
    const user = this.userServiceRest.getOne(userId);
    if (!user) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    if (!data.wishesIds) {
      const list = await this.initList(userId, data);
      return await this.listServiceDomain.create(list);
    }
    const res = await this.checkWishes(data.wishesIds, userId);
    if (res === true) {
      const list = await this.initList(userId, data);
      return await this.listServiceDomain.create(list);
    }
  }

  async delete(userId: number, id: number) {
    const user = this.userServiceRest.getOne(userId);
    if (!user) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    const list: List = await this.listServiceDomain.findOne(id);
    if (list.owner.id !== userId) {
      throw new HttpException('List not yours', HttpStatus.BAD_REQUEST);
    }
    return await this.listServiceDomain.remove(id);
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
        const wish = await this.wishServiceRest.getOne(data.wishesIds[i]);
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
    return await this.userServiceRest.getOne(userId);
  }

  async checkWishes(ids: number[], userId: number): Promise<boolean> {
    for (let i = 0; i < ids.length; i++) {
      const res = await this.wishServiceRest.checkUserWish(ids[i], userId);
      if (res === false) {
        throw new HttpException(
          `You doesn't have the wish with id ${ids[i]}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return true;
  }

  async update(userId: number, id: number, data: UpdateListDto) {
    const user = this.userServiceRest.getOne(userId);
    if (!user) {
      throw new HttpException(`User doesnt exists`, HttpStatus.BAD_REQUEST);
    }
    const list: List = await this.listServiceDomain.findOne(id);
    if (!list) {
      throw new HttpException('Error! List not found', HttpStatus.NOT_FOUND);
    }
    if (list.owner.id !== userId) {
      throw new HttpException('Error! List not yours', HttpStatus.NOT_FOUND);
    }
    const updatedList = { ...list, ...data };
    return await this.listServiceDomain.update(updatedList);
  }
}
