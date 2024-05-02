import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from '../entities/list.entity';
import { ListWish } from '../entities/list-wish.entity';
import { IListService } from '../typing/interfaces/list.service.interface';
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '../../../shared/events/typing/enums/event.enum';
import { IEventsPayloads } from '../../../shared/events/typing/interfaces/event.interface';

@Injectable()
export class ListsServiceDomain implements IListService {
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

  async findAll() {
    return await this.listRepository.find();
  }

  async findOne(id: number) {
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

  async update(list: List) {
    return await this.listRepository.save(list);
  }

  async remove(id: number) {
    return await this.listRepository.delete(id);
  }

  @OnEvent(Events.onListExpired)
  async removeExpiredLists(payload: IEventsPayloads[Events.onListExpired]) {
    for (const listId of payload.listIds) {
      await this.remove(listId);
    }
  }
}
