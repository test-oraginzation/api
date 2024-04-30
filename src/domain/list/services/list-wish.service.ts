import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ListWish } from '../entities/list-wish.entity';
import { ListWishServiceInterface } from '../typing/interfaces/list-wish.service.interface';
@Injectable()
export class ListWishServiceDomain implements ListWishServiceInterface {
  constructor(
    @InjectRepository(ListWish)
    private listWishRepository: Repository<ListWish>,
  ) {}

  async create(listWish: ListWish): Promise<ListWish> {
    const newList = this.listWishRepository.create(listWish);
    return await this.listWishRepository.save(newList);
  }

  async findOneByListId(listId: number): Promise<ListWish[]> {
    return await this.listWishRepository.find({
      where: { list: { id: listId } },
    });
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.listWishRepository.delete(id);
  }
}
