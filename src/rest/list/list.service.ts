import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ListsServiceDomain } from '../../domain/list/services/lists.service';
import { List } from '../../domain/list/entities/list.entity';
import { UserListWishServiceDomain } from '../../domain/user/services/user-list-wish.service';
import { UserListWish } from '../../domain/user/entities/user-list-wish.entity';
import { RedisService } from '../../libs/redis/services/redis.service';
import { MinioService } from '../../libs/minio/services/minio.service';
import {
  UpdateListDto,
  UpdateWishesInListDto,
  UserListWishDto,
} from './dto/list.dto';
import { LoggerService, LogLevel } from '../../shared/logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/user/entities/user.entity';
import { Wish } from '../../domain/wish/entities/wish.entity';
import { SORT_TYPE } from '../../shared/sort.enum';

@Injectable()
export class ListServiceRest {
  constructor(
    private listServiceDomain: ListsServiceDomain,
    private userListWishServiceDomain: UserListWishServiceDomain,
    private redisService: RedisService,
    private minioService: MinioService,
    private logger: LoggerService,
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
    const list: List = <List>{
      private: data.private,
      name: data.name,
      description: data.description,
      photo: data.photo,
      user: { id: userId } as User,
    };
    const createdList = await this.listServiceDomain.create(list);
    await this.logger.log(
      `list:${createdList.id} created`,
      userId,
      LogLevel.INFO,
    );
    return createdList;
  }

  async getAllByUserId(userId: number) {
    return await this.getWishLists(userId);
  }

  async getAllByUserIdWithLimit(userId: number, limit: number) {
    const wishLists = await this.getWishLists(userId);
    return wishLists.slice(-limit);
  }

  async getAllByUserIdWithSortType(userId: number, sort: string) {
    const wishLists = await this.getWishLists(userId);
    if (sort === SORT_TYPE.ASC) {
      return wishLists.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if (sort === SORT_TYPE.DESC) {
      return wishLists.sort((a, b) => (a.name < b.name ? 1 : -1));
    } else {
      return wishLists.sort((a, b) => (a.name > b.name ? 1 : -1));
    }
  }

  async getOneByUserID(userId: number, id: number) {
    return await this.getWishList(userId, id);
  }

  async updateList(userId: number, id: number, data: UpdateListDto) {
    if (!data) {
      throw new HttpException('Send data to update', HttpStatus.BAD_REQUEST);
    }
    const list = await this.validateList(id);
    const listToUpdate: List = { ...list, ...data };
    const updatedList = await this.listServiceDomain.update(listToUpdate);
    await this.logger.log(
      `list:${updatedList.id} updated`,
      userId,
      LogLevel.INFO,
    );
    return updatedList;
  }

  async updateWishesInList(
    userId: number,
    listId: number,
    data: UpdateWishesInListDto,
  ) {
    const deletedRes =
      await this.listServiceDomain.removeUserListWishes(listId);
    if (deletedRes) {
      await this.createUserWishLists(userId, listId, data);
    }
    const wishList = await this.getWishList(userId, listId);
    await this.logger.log(
      `wishes in list:${wishList.id} updated`,
      userId,
      LogLevel.INFO,
    );
    return wishList;
  }

  async updatePhoto(userId: number, listId: number) {
    const url = await this.minioService.getPhoto(
      await this.redisService.getListPhotoName(listId),
    );
    return await this.updateList(userId, listId, { photo: url });
  }

  async delete(userId: number, id: number) {
    const wishLists = await this.userListWishServiceDomain.findOneByListId(id);
    for (let i = 0; i < wishLists.length; i++) {
      await this.userListWishServiceDomain.remove(wishLists[i].id);
    }
    await this.listServiceDomain.remove(id);
    await this.logger.log(`deleted list: ${id}`, userId, LogLevel.INFO);
    return `Successfully deleted list ${id}`;
  }

  private async validateList(id: number) {
    const list: List = await this.listServiceDomain.findOne(id);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    return list;
  }

  private async createUserWishLists(
    userId: number,
    listId: number,
    data: UpdateWishesInListDto,
  ) {
    const list = await this.listServiceDomain.findOne(listId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    for (const wishId of data.wishIds) {
      const userListWish: UserListWish = <UserListWish>{
        user: { id: userId } as User,
        list: { id: listId } as List,
        wish: { id: wishId } as Wish,
      };
      const createdUserListWish =
        await this.userListWishServiceDomain.create(userListWish);
      console.log(`createdUserListWIsh = ${createdUserListWish}`);
    }
  }

  private async getWishLists(userId: number) {
    const lists: List[] = await this.listServiceDomain.findAllByUserID(userId);
    const wishLists: UserListWish[] = await this.userListWishRepository
      .createQueryBuilder('ulw')
      .leftJoinAndSelect('ulw.list', 'list')
      .leftJoinAndSelect('list.userListWishes', 'userListWishes')
      .leftJoinAndSelect('userListWishes.wish', 'wish')
      .where('ulw.user = :userId', { userId: userId })
      .getMany();

    console.log(wishLists);
    const mappedWishLists: { [key: number]: UserListWishDto } = {};
    wishLists.forEach((ulw) => {
      const listId = ulw.list.id;
      if (!mappedWishLists[listId]) {
        mappedWishLists[listId] = {
          id: ulw.list.id,
          name: ulw.list.name,
          description: ulw.list.description,
          wishIds: ulw.list.userListWishes.map((ulw) => ulw.wish.id),
          photo: ulw.list.photo,
          private: ulw.list.private,
        };
      }
    });

    lists.forEach((list) => {
      if (!mappedWishLists[list.id]) {
        mappedWishLists[list.id] = { ...list };
      }
    });

    return Object.values(mappedWishLists);
  }

  private async getWishList(userId: number, listId: number) {
    const list = await this.listServiceDomain.findOne(listId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    if (list.user.id !== userId) {
      throw new HttpException('List not yours', HttpStatus.FORBIDDEN);
    }
    const wishList: UserListWish = await this.userListWishRepository
      .createQueryBuilder('ulw')
      .leftJoinAndSelect('ulw.list', 'list')
      .leftJoinAndSelect('list.userListWishes', 'userListWishes')
      .leftJoinAndSelect('userListWishes.wish', 'wish')
      .where('ulw.user = :userId', { userId: userId })
      .andWhere('ulw.list = :listId', { listId: listId })
      .getOne();
    console.log(`wishlist ${wishList}`);
    if (wishList) {
      const wishListRes: UserListWishDto = {
        id: wishList.list.id,
        name: wishList.list.name,
        description: wishList.list.description,
        wishIds: wishList.list.userListWishes.map((ulw) => ulw.wish.id),
        photo: wishList.list.photo,
        private: wishList.list.private,
      };
      return wishListRes;
    }
    const wishListRes: UserListWishDto = {
      id: list.id,
      name: list.name,
      description: list.description,
      wishIds: [],
      photo: list.photo,
      private: list.private,
    };
    return wishListRes;
  }
}
