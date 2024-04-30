import { List } from '../../entities/list.entity';
import { DeleteResult } from 'typeorm';

export interface ListServiceInterface {
  create(list: List): Promise<List>;
  findOne(id: number): Promise<List>;
  removeUserListWishes(listId: number): Promise<boolean>;
  update(list: List): Promise<List>;
  remove(id: number): Promise<DeleteResult>;
}
