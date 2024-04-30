import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Wish } from '../../wish/entities/wish.entity';
import { List } from './list.entity';
import { ListWishEntityInterface } from '../typing/interfaces/list-wish.entity.interface';

@Entity({ name: 'list_wish' })
export class ListWish implements ListWishEntityInterface {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => List, (list) => list.listWishes)
  list?: List;

  listId: number;

  @ManyToOne(() => Wish, (wish) => wish.listWishes)
  wish?: Wish;

  wishId: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;
}
