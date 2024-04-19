import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserServiceRest } from '../user/user.service';
import { ListsServiceDomain } from '../../domain/list/services/lists.service';
import { List } from '../../domain/list/entities/list.entity';
import { UserListWishServiceDomain } from '../../domain/user/services/user-list-wish.service';
import {
  AddWishesToListDto,
  CreateUserListWishDto,
  UpdateUserListWishDto,
  UserListWishDto,
} from './dto/user-list-wish.dto';
import { UserListWish } from '../../domain/user/entities/user-list-wish.entity';
import { RedisService } from '../../libs/redis/services/redis.service';
import { MinioService } from '../../libs/minio/services/minio.service';
import { WishServiceDomain } from '../../domain/wish/services/wish.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ListServiceRest {
  constructor(
    private listServiceDomain: ListsServiceDomain,
    private userServiceRest: UserServiceRest,
    private userListWishServiceDomain: UserListWishServiceDomain,
    private readonly redisService: RedisService,
    private readonly minioService: MinioService,
    private wishServiceDomain: WishServiceDomain,
    @InjectRepository(UserListWish)
    private userListWishRepository: Repository<UserListWish>,
  ) {}

  async getAll() {
    return this.listServiceDomain.findAll();
  }

  async create(userId: number, data: UserListWishDto) {
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
    return await this.listServiceDomain.create(list);
  }

  async getAllByUserId(userId: number) {
    return await this.getWishLists(userId);
  }

  async getOneByUserID(userId: number, id: number) {
    return await this.getWishList(userId, id);
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

  async addWishesToList(
    userId: number,
    listId: number,
    data: AddWishesToListDto,
  ) {
    const list: List = await this.listServiceDomain.findOne(listId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    if (!data) {
      throw new HttpException('Send data to update', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userServiceRest.getOne(userId);
    for (const wishId of data.wishIds) {
      const checkUserListWish =
        await this.userListWishServiceDomain.findWishInListByWishId(wishId);
      console.log(
        `try to add wish into list ${wishId}, value in uWl: ${checkUserListWish}`,
      );
      if (!checkUserListWish) {
        console.log('updating wishes in wishlist...');
        const wish = await this.wishServiceDomain.findOne(wishId);
        const userListWish: UserListWish = <UserListWish>{
          wish: wish,
          list: list,
          user: user,
        };
        const createdData =
          await this.userListWishServiceDomain.create(userListWish);
        console.log(createdData);
      }
    }
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

  private async createUserListWish(
    createUserListWishDto: CreateUserListWishDto,
  ) {
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

  private async updateUserListWish(
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
        const checkUserListWish =
          await this.userListWishServiceDomain.findWishInListByWishId(
            Number(wish),
          );
        console.log(
          `try to add wish into list ${wish}, value in uWl: ${checkUserListWish}`,
        );
        if (!checkUserListWish) {
          console.log('updating wishes in wishlist...');
          const userListWish: UserListWish = <UserListWish>{
            wish,
            list: updatedList,
            user,
          };
          const createdData =
            await this.userListWishServiceDomain.create(userListWish);
          console.log(createdData);
        }
      }
    }
    return await this.getOneByUserID(user.id, list.id);
  }

  private async getWishLists(userId: number) {
    const wishListsRes: UserListWish[] = await this.userListWishRepository
      .createQueryBuilder('ulw')
      .leftJoinAndSelect('ulw.list', 'list')
      .leftJoinAndSelect('list.userListWishes', 'userListWishes')
      .leftJoinAndSelect('userListWishes.wish', 'wish')
      .where('ulw.user = :userId', { userId: userId })
      .getMany();

    return wishListsRes.map((ulw) => ({
      id: ulw.list.id,
      name: ulw.list.name,
      description: ulw.list.description,
      wishes: ulw.list.userListWishes.map((ulw) => ulw.wish),
      photo: ulw.list.photo,
      private: ulw.list.private,
    }));
  }

  private async getWishList(userId: number, listId: number) {
    const wishListsRes: UserListWish[] = await this.userListWishRepository
      .createQueryBuilder('ulw')
      .leftJoinAndSelect('ulw.list', 'list')
      .leftJoinAndSelect('list.userListWishes', 'userListWishes')
      .leftJoinAndSelect('userListWishes.wish', 'wish')
      .where('ulw.user = :userId', { userId: userId })
      .andWhere('ulw.list = :listId', { listId: listId })
      .getMany();

    return {
      id: wishListsRes[0].list.id,
      name: wishListsRes[0].list.name,
      description: wishListsRes[0].list.description,
      wishes: wishListsRes[0].list.userListWishes.map((ulw) => ulw.wish),
      photo: wishListsRes[0].list.photo,
      private: wishListsRes[0].list.private,
    };
  }
}
