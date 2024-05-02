import { Wish } from '../entities/wish.entity';
import { DeleteResult } from 'typeorm';
import { IEventsPayloads } from '../../../shared/events/typing/interfaces/event.interface';
import { Events } from '../../../shared/events/typing/enums/event.enum';

export interface IWishService {
  create(wish: Wish): Promise<Wish>;
  findAll(): Promise<Wish[]>;
  findOne(id: number): Promise<Wish>;
  findOneByUserId(userId: number, id: number): Promise<Wish>;
  update(wish: Wish): Promise<Wish>;
  remove(id: number): Promise<DeleteResult>;
  createDefaultWish(
    payload: IEventsPayloads[Events.onUserCreated],
  ): Promise<void>;
}
