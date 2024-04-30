import { Wish } from '../entities/wish.entity';
import { DeleteResult } from 'typeorm';

export interface WishServiceInterface {
  create(wish: Wish): Promise<Wish>;
  findAll(): Promise<Wish[]>;
  findOne(id: number): Promise<Wish>;
  findOneByUserId(userId: number, id: number): Promise<Wish>;
  update(wish: Wish): Promise<Wish>;
  remove(id: number): Promise<DeleteResult>;
}
