import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListWish } from '../entities/list-wish.entity';
@Injectable()
export class UserListWishServiceDomain {
  constructor(
    @InjectRepository(ListWish)
    private listWishRepository: Repository<ListWish>,
  ) {}

  async create(listWish: ListWish) {
    const newList = this.listWishRepository.create(listWish);
    return await this.listWishRepository.save(newList);
  }

  async findOneByListId(listId: number) {
    return await this.listWishRepository.find({
      where: { list: { id: listId } },
    });
  }

  async remove(id: number) {
    return await this.listWishRepository.delete(id);
  }
}
