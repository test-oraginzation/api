import { List } from '../../entities/list.entity';
import { Wish } from '../../../wish/entities/wish.entity';

export interface IListWishEntity {
  id: number;
  list?: List;
  listId: number;
  wish?: Wish;
  wishId: number;
  createdDate: Date;
}
