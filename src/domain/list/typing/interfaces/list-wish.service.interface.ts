import { ListWish } from '../../entities/list-wish.entity';
import { DeleteResult } from 'typeorm';

export interface ListWishServiceInterface {
  create(listWish: ListWish): Promise<ListWish>;
  findOneByListId(listId: number): Promise<ListWish[]>;
  remove(id: number): Promise<DeleteResult>;
}
