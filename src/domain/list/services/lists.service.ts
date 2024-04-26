import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../entities/list.entity';
import { UserListWish } from '../../user/entities/user-list-wish.entity';
import { UserListWishDto } from '../../../rest/list/dto/list.dto';

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
