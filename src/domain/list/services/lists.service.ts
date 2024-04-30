import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { List } from '../entities/list.entity';
import { ListWish } from '../entities/list-wish.entity';
import { ListServiceInterface } from '../typing/interfaces/list.service.interface';

@Injectable()
export class ListsServiceDomain implements ListServiceInterface {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(ListWish)
    private listWishRepository: Repository<ListWish>,
  ) {}

  async create(list: List): Promise<List> {
    const newList = this.listRepository.create(list);
    return await this.listRepository.save(newList);
  }

  async findAll(): Promise<List[]> {
    return await this.listRepository.find();
  }

  async findOne(id: number): Promise<List> {
    return await this.listRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }

  async removeUserListWishes(listId: number): Promise<boolean> {
    await this.listWishRepository
      .createQueryBuilder()
      .delete()
      .from(ListWish)
      .where('listId = :listId', { listId })
      .execute();

    console.log(`Deleted all user list wishes for list ${listId}`);
    return true;
  }

  async update(list: List): Promise<List> {
    return await this.listRepository.save(list);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.listRepository.delete(id);
  }
}
