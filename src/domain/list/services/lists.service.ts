import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../entities/list.entity';
import { ListWish } from '../entities/list-wish.entity';
import { ListWishDto } from '../../../rest/list/dto/list.dto';

@Injectable()
export class ListsServiceDomain {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(ListWish)
    private listWishRepository: Repository<ListWish>,
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
    await this.listWishRepository
      .createQueryBuilder()
      .delete()
      .from(ListWish)
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
