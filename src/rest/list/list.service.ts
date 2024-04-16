import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserServiceRest } from '../user/user.service';
import { ListsServiceDomain } from '../../domain/list/services/lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { List } from '../../domain/list/entities/list.entity';
import { UpdateListDto } from './dto/update-list.dto';
import { WishServiceRest } from '../wish/wish.service';
import { UserListWishServiceDomain } from '../../domain/user-list-wish/services/user-list-wish.service';
import {
  CreateUserListWishDto,
  UserListWishDto,
} from './dto/user-list-wish.dto';
import { UserListWish } from '../../domain/user-list-wish/entities/user-list-wish.entity';
import { Wish } from '../../domain/wish/entities/wish.entity';

@Injectable()
export class ListServiceRest {
  constructor(
    private listServiceDomain: ListsServiceDomain,
    private wishServiceRest: WishServiceRest,
    private userServiceRest: UserServiceRest,
    private userListWishServiceDomain: UserListWishServiceDomain,
  ) {}

  async getAll() {
    return this.listServiceDomain.findAll();
  }

  async getOne(id: number) {
    return this.listServiceDomain.findOne(id);
  }

  async create(userId: number, data: CreateListDto) {
    return await this.createList(userId, data);
  }

  async getAllByUserId(userId: number) {
    const wishLists: UserListWish[] =
      await this.userListWishServiceDomain.findAllListsByUserId(userId);

    console.log(wishLists);
    console.log(wishLists[0]);
    console.log(wishLists[0].list);

    const wishListsRes: UserListWishDto[] = [];
    for (let i: number = 0; i < wishLists.length; i++) {
      const wishes: Wish[] =
        await this.userListWishServiceDomain.findWishesInListByListId(
          wishLists[i].list.id,
        );
      wishListsRes.push({
        id: wishLists[i].list.id,
        name: wishLists[i].list.name,
        description: wishLists[i].list.description,
        wishes: wishes,
      });
    }

    return wishListsRes;
  }

  async getOneByUserID(userId: number, id: number) {
    return await this.userListWishServiceDomain.findUserListWishes(id, userId);
  }

  async updateList(userId: number, id: number, data: UpdateListDto) {
    const list: List = await this.listServiceDomain.findOne(id);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    if (list.user.id !== userId) {
      throw new HttpException('List not yours', HttpStatus.UNAUTHORIZED);
    }
    if (!data) {
      throw new HttpException('Send data to update', HttpStatus.BAD_REQUEST);
    }
    const updatedList = { ...list, ...data };
    return await this.listServiceDomain.update(updatedList);
  }

  async delete(id: number) {
    const wishLists = await this.userListWishServiceDomain.findOneByUserId(id);
    for (let i = 0; i < wishLists.length; i++) {
      await this.userListWishServiceDomain.remove(wishLists[i].id);
      console.log(`deleted wishlist ${wishLists[i].id}`);
    }
    await this.listServiceDomain.remove(id);
    console.log(`deleted list ${id}`);
    return 'Success';
  }

  async createList(userId: number, data: CreateListDto) {
    if (!data.name || !data.description) {
      throw new HttpException(
        'Name and description required',
        HttpStatus.BAD_REQUEST,
      );
    }
    // @ts-ignore //TODO: fix ts ignore
    const list: List = {
      private: data.private,
      name: data.name,
      description: data.description,
      photo: data.photo,
    };
    const createdList: List = await this.listServiceDomain.create(list);
    if (data.wishes) {
      const userListWishData: CreateUserListWishDto = {
        userId: userId,
        wishes: data.wishes,
        listId: createdList.id,
      };
      return await this.createUserListWish(userListWishData);
    }
    return createdList;
  }

  async createUserListWish(createUserListWishDto: CreateUserListWishDto) {
    const user = await this.userServiceRest.getOne(
      createUserListWishDto.userId,
    );
    const list = await this.listServiceDomain.findOne(
      createUserListWishDto.listId,
    );
    for (let i = 0; i < createUserListWishDto.wishes.length; i++) {
      // @ts-ignore //TODO: fix ts ignore
      const userListWish: UserListWish = {
        wish: createUserListWishDto.wishes[i],
        list,
        user,
      };
      const createdData =
        await this.userListWishServiceDomain.create(userListWish);
      console.log(createdData);
    }
  }
}
