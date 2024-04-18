import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserServiceRest } from '../user/user.service';
import { ListsServiceDomain } from '../../domain/list/services/lists.service';
import { List } from '../../domain/list/entities/list.entity';
import { UserListWishServiceDomain } from '../../domain/user-list-wish/services/user-list-wish.service';
import {
  CreateUserListWishDto,
  UpdateUserListWishDto,
  UserListWishDto,
} from './dto/user-list-wish.dto';
import { UserListWish } from '../../domain/user-list-wish/entities/user-list-wish.entity';
import { Wish } from '../../domain/wish/entities/wish.entity';
import { RedisService } from '../../libs/redis/services/redis.service';
import { MinioService } from '../../libs/minio/services/minio.service';

@Injectable()
export class ListServiceRest {
  constructor(
    private listServiceDomain: ListsServiceDomain,
    private userServiceRest: UserServiceRest,
    private userListWishServiceDomain: UserListWishServiceDomain,
    private readonly redisService: RedisService,
    private readonly minioService: MinioService,
  ) {}

  async getAll() {
    return this.listServiceDomain.findAll();
  }

  async create(userId: number, data: UserListWishDto) {
    return await this.createList(userId, data);
  }

  async getAllByUserId(userId: number) {
    const wishLists: UserListWish[] =
      await this.userListWishServiceDomain.findAllListsByUserId(userId);
    return await this.initWishLists(wishLists);
  }

  async getOneByUserID(userId: number, id: number) {
    const wishesInList: UserListWish[] =
      await this.userListWishServiceDomain.findUserListWishes(id, userId);
    return await this.initWishLists(wishesInList);
  }

  async update(userId: number, id: number, data: UpdateUserListWishDto) {
    const list: List = await this.listServiceDomain.findOne(id);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    if (!data) {
      throw new HttpException('Send data to update', HttpStatus.BAD_REQUEST);
    }
    return await this.updateUserListWish(userId, list, data);
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

  async createList(userId: number, data: UserListWishDto) {
    if (!data.name || !data.description) {
      throw new HttpException(
        'Name and description required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userServiceRest.getOne(userId);
    const list: List = <List>{
      private: data.private,
      name: data.name,
      description: data.description,
      photo: data.photo,
      user: user,
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

  async updatePhoto(userId: number, listId: number) {
    const list: List = await this.listServiceDomain.findOne(listId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    console.log(list);
    const url = await this.minioService.getPhoto(
      await this.redisService.getListPhotoName(listId),
    );
    return await this.update(userId, listId, { photo: url });
  }

  async createUserListWish(createUserListWishDto: CreateUserListWishDto) {
    const user = await this.userServiceRest.getOne(
      createUserListWishDto.userId,
    );
    const list = await this.listServiceDomain.findOne(
      createUserListWishDto.listId,
    );
    for (const wish of createUserListWishDto.wishes) {
      const userListWish: UserListWish = <UserListWish>{
        wish,
        list,
        user,
      };
      const createdData =
        await this.userListWishServiceDomain.create(userListWish);
      console.log(createdData);
    }
  }

  async updateUserListWish(
    userId: number,
    list: List,
    data: UpdateUserListWishDto,
  ) {
    const user = await this.userServiceRest.getOne(userId);
    const updatedList: List = await this.listServiceDomain.update({
      ...list,
      ...data,
    });
    if (data.wishes) {
      for (const wish of data.wishes) {
        const userListWish: UserListWish = <UserListWish>{
          wish,
          list: updatedList,
          user,
        };
        const checkUserListWish = await this.userListWishServiceDomain.findOne(
          userListWish.id,
        );
        if (!checkUserListWish) {
          const createdData =
            await this.userListWishServiceDomain.create(userListWish);
          console.log(createdData);
        }
      }
    }
    return await this.getOneByUserID(user.id, list.id);
  }

  async initWishLists(wishLists: UserListWish[]) {
    const wishListsRes: UserListWishDto[] = [];
    let counterId = null;
    for (let i: number = 0; i < wishLists.length; i++) {
      if (wishLists[i].list.id !== counterId) {
        const wishes: Wish[] =
          await this.userListWishServiceDomain.findWishesInListByListId(
            wishLists[i].list.id,
          );
        wishListsRes.push({
          id: wishLists[i].list.id,
          name: wishLists[i].list.name,
          description: wishLists[i].list.description,
          wishes: wishes,
          photo: wishLists[i].list.photo,
          private: wishLists[i].list.private,
        });
      }
      counterId = wishLists[i].list.id;
    }
    return wishListsRes;
  }
}
