import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ListsServiceDomain } from '../../domain/list/services/lists.service';
import { List } from '../../domain/list/entities/list.entity';
import { UserListWishServiceDomain } from '../../domain/list/services/list-wish.service';
import { ListWish } from '../../domain/list/entities/list-wish.entity';
import { RedisService } from '../../libs/redis/services/redis.service';
import { MinioService } from '../../libs/minio/services/minio.service';
import {
  UpdateListDto,
  UpdateWishesInListDto,
  ListWishDto,
} from './dto/list.dto';
import { LoggerService, LogLevel } from '../../shared/logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/user/entities/user.entity';
import { Wish } from '../../domain/wish/entities/wish.entity';
import { IPagination } from '../../shared/pagination/pagination.interface';
import { applyPaginationParams } from '../../shared/pagination/pagination.utils';

@Injectable()
export class ListServiceRest {
  constructor(
    private listServiceDomain: ListsServiceDomain,
    private userListWishServiceDomain: UserListWishServiceDomain,
    private redisService: RedisService,
    private minioService: MinioService,
    private logger: LoggerService,
    @InjectRepository(ListWish)
    private userListWishRepository: Repository<ListWish>,
    @InjectRepository(List)
    private listRepository: Repository<List>,
  ) {}

  async getAll() {
    return this.listServiceDomain.findAll();
  }

  async create(userId: number, data: ListWishDto) {
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

  async getAllByUserId(userId: number, params: IPagination) {
    return await this.getWishLists(userId, params);
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
      await this.createUserWishLists(listId, data);
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
    listId: number,
    data: UpdateWishesInListDto,
  ) {
    const list = await this.listServiceDomain.findOne(listId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    for (const wishId of data.wishIds) {
      const userListWish: ListWish = <ListWish>{
        list: { id: listId } as List,
        wish: { id: wishId } as Wish,
      };
      const createdUserListWish =
        await this.userListWishServiceDomain.create(userListWish);
      console.log(`createdUserListWIsh = ${createdUserListWish}`);
    }
  }

  private async getWishLists(userId: number, params?: IPagination) {
    const listQuery = this.listRepository
      .createQueryBuilder('list')
      .where('list.user = :userId', { userId: userId });

    if (params.search) {
      listQuery.andWhere('list.name LIKE :userName', {
        userName: `%${params.search}%`,
      });
    }

    applyPaginationParams(listQuery, params, 'list.name');

    const lists: List[] = await listQuery.getMany();
    if (lists.length === 0) {
      return [];
    }

    const listIds = lists.map((list) => list.id);

    const query = this.userListWishRepository
      .createQueryBuilder('lw')
      .leftJoinAndSelect('lw.list', 'list')
      .leftJoinAndSelect('list.listWishes', 'listWishes')
      .leftJoinAndSelect('listWishes.wish', 'wish')
      .where('lw.list.id IN (:...listIds)', { listIds: listIds });

    const wishLists: ListWish[] = await query.getMany();

    const mappedWishLists: { [key: number]: ListWishDto } = {};
    wishLists.forEach((lw) => {
      const listId = lw.list.id;
      if (!mappedWishLists[listId]) {
        mappedWishLists[listId] = {
          id: lw.list.id,
          name: lw.list.name,
          description: lw.list.description,
          wishIds: lw.list.listWishes.map((ulw) => ulw.wish.id),
          photo: lw.list.photo,
          private: lw.list.private,
          updatedDate: lw.list.updatedDate,
          createdDate: lw.list.createdDate,
        };
      }
    });

    lists.forEach((list) => {
      if (!mappedWishLists[list.id]) {
        mappedWishLists[list.id] = { ...list };
      }
    });

    return {
      count: Object.values(mappedWishLists).length,
      items: Object.values(mappedWishLists),
    };
  }

  private async getWishList(userId: number, listId: number) {
    const list = await this.listServiceDomain.findOne(listId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    if (list.user.id !== userId) {
      throw new HttpException('List not yours', HttpStatus.FORBIDDEN);
    }
    const wishList: ListWish = await this.userListWishRepository
      .createQueryBuilder('lw')
      .leftJoinAndSelect('lw.list', 'list')
      .leftJoinAndSelect('list.listWishes', 'listWishes')
      .leftJoinAndSelect('listWishes.wish', 'wish')
      .where('lw.list.user = :userId', { userId: userId })
      .andWhere('lw.list = :listId', { listId: listId })
      .getOne();
    console.log(`wishlist ${wishList}`);
    if (wishList) {
      const wishListRes: ListWishDto = {
        id: wishList.list.id,
        name: wishList.list.name,
        description: wishList.list.description,
        wishIds: wishList.list.listWishes.map((ulw) => ulw.wish.id),
        photo: wishList.list.photo,
        private: wishList.list.private,
      };
      return wishListRes;
    }
    const wishListRes: ListWishDto = {
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
