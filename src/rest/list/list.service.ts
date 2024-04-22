import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ListsServiceDomain } from "../../domain/list/services/lists.service";
import { List } from "../../domain/list/entities/list.entity";
import { UserListWishServiceDomain } from "../../domain/user/services/user-list-wish.service";
import { UserListWish } from "../../domain/user/entities/user-list-wish.entity";
import { RedisService } from "../../libs/redis/services/redis.service";
import { MinioService } from "../../libs/minio/services/minio.service";
import { WishServiceDomain } from "../../domain/wish/services/wish.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateListDto, UpdateWishesInListDto, UserListWishDto } from "./dto/list.dto";
import { UserServiceDomain } from "../../domain/user/services/user.service";

@Injectable()
export class ListServiceRest {
  constructor(
    private listServiceDomain: ListsServiceDomain,
    private userServiceDomain: UserServiceDomain,
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
    const user = await this.userServiceDomain.findOne(userId);
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

  async updateList(id: number, data: UpdateListDto) {
    if (!data) {
      throw new HttpException('Send data to update', HttpStatus.BAD_REQUEST);
    }
    const list = await this.validateList(id);
    const listToUpdate: List = { ...list, ...data };
    return await this.listServiceDomain.update(listToUpdate);
  }

  async updateWishesInList(
    userId: number,
    listId: number,
    data: UpdateWishesInListDto,
  ) {
    const deletedRes = await this.deleteUserListWishes(listId);
    if (deletedRes) {
      const user = await this.userServiceDomain.findOne(userId);
      const list = await this.listServiceDomain.findOne(listId);

      for (const wishId of data.wishIds) {
        const wish = await this.wishServiceDomain.findOne(wishId);
        if (!wish) {
          continue;
        }

        const userListWish: UserListWish = <UserListWish>{
          user: user,
          list: list,
          wish: wish,
        };

        await this.userListWishServiceDomain.create(userListWish);
      }
    }
    return await this.getWishList(userId, listId);
  }

  async updatePhoto(listId: number) {
    const url = await this.minioService.getPhoto(
      await this.redisService.getListPhotoName(listId),
    );
    return await this.updateList(listId, { photo: url });
  }

  async delete(id: number) {
    const wishLists = await this.userListWishServiceDomain.findOneByUserId(id);
    for (let i = 0; i < wishLists.length; i++) {
      await this.userListWishServiceDomain.remove(wishLists[i].id);
      console.log(`deleted wishlist ${wishLists[i].id}`);
    }
    await this.listServiceDomain.remove(id);
    console.log(`deleted list ${id}`);
    return `Successfully deleted list ${id}`;
  }

  private async deleteUserListWishes(listId: number) {
    await this.userListWishRepository
      .createQueryBuilder()
      .delete()
      .from(UserListWish)
      .where('listId = :listId', { listId })
      .execute();

    console.log(`Deleted all user list wishes for list ${listId}`);
    return true;
  }

  private async getWishLists(userId: number) {
    const lists: List[] = await this.listServiceDomain.findAll();
    const wishLists: UserListWish[] = await this.userListWishRepository
      .createQueryBuilder('ulw')
      .leftJoinAndSelect('ulw.list', 'list')
      .leftJoinAndSelect('list.userListWishes', 'userListWishes')
      .leftJoinAndSelect('userListWishes.wish', 'wish')
      .where('ulw.user = :userId', { userId: userId })
      .getMany();

    const mappedWishLists: UserListWishDto[] = wishLists.map((ulw) => ({
      id: ulw.list.id,
      name: ulw.list.name,
      description: ulw.list.description,
      wishes: ulw.list.userListWishes.map((ulw) => ulw.wish),
      photo: ulw.list.photo,
      private: ulw.list.private,
    }));

    let checker = true;

    for (const list of lists) {
      for (const wishList of mappedWishLists) {
        if (list.id === wishList.id) {
          checker = false;
        }
      }
      if (checker === true) {
        mappedWishLists.push({ ...list });
      }
      console.log(`${list.id} checker: ${checker}`);
      checker = true;
      console.log(`checker: ${checker}`);
    }

    return mappedWishLists;
  }

  private async getWishList(userId: number, listId: number) {
    const wishList: UserListWish = await this.userListWishRepository
      .createQueryBuilder('ulw')
      .leftJoinAndSelect('ulw.list', 'list')
      .leftJoinAndSelect('list.userListWishes', 'userListWishes')
      .leftJoinAndSelect('userListWishes.wish', 'wish')
      .where('ulw.user = :userId', { userId: userId })
      .andWhere('ulw.list = :listId', { listId: listId })
      .getOne();

    const wishListRes: UserListWishDto = {
      id: wishList.list.id,
      name: wishList.list.name,
      description: wishList.list.description,
      wishes: wishList.list.userListWishes.map((ulw) => ulw.wish),
      photo: wishList.list.photo,
      private: wishList.list.private,
    };
    console.log(wishListRes);
    console.log(wishList);
    if (!wishList) {
      const list = await this.listServiceDomain.findOne(listId);
      console.log(list);
      return list;
    }
    return wishListRes;
  }

  private async validateList(id: number) {
    const list: List = await this.listServiceDomain.findOne(id);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    return list;
  }
}
