import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../entities/list.entity';
import { UserListWish } from '../../user/entities/user-list-wish.entity';
import { UserListWishDto } from '../../../rest/list/dto/list.dto';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class ListsServiceDomain {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(UserListWish)
    private userListWishRepository: Repository<UserListWish>,
  ) {}

  async create(list: List) {
    const newList = this.listRepository.create(list);
    return await this.listRepository.save(newList);
  }

  async findAllByUserID(userId: number) {
    return await this.listRepository.find({
      where: {
        user: { id: userId },
      },
    });
  }

  async findAll() {
    return await this.listRepository.find();
  }

  async findOne(id: number) {
    return await this.listRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }

  async findOneWishList(userId: number, listId: number) {
    return await this.getWishList(userId, listId);
  }

  async findAllWishList(userId: number) {
    return await this.getWishLists(userId);
  }

  private async getWishList(userId: number, listId: number) {
    const list = await this.findOne(listId);
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
        wishes: wishList.list.userListWishes.map((ulw) => ulw.wish),
        photo: wishList.list.photo,
        private: wishList.list.private,
      };
      return wishListRes;
    }
    const wishListRes: UserListWishDto = {
      id: list.id,
      name: list.name,
      description: list.description,
      wishes: [],
      photo: list.photo,
      private: list.private,
    };
    return wishListRes;
  }
  private async getWishLists(userId: number) {
    const lists: List[] = await this.findAllByUserID(userId);
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

    console.log(mappedWishLists);

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

  async removeUserListWishes(listId: number) {
    await this.userListWishRepository
      .createQueryBuilder()
      .delete()
      .from(UserListWish)
      .where('listId = :listId', { listId })
      .execute();

    console.log(`Deleted all user list wishes for list ${listId}`);
    return true;
  }

  async update(list: List) {
    return await this.listRepository.save(list);
  }

  async remove(id: number) {
    return await this.listRepository.delete(id);
  }
}
