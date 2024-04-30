import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Wish } from '../../wish/entities/wish.entity';
import { List } from './list.entity';

@Entity({ name: 'list_wish' })
export class ListWish {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => List, (list) => list.listWishes)
  list: List;

  @ManyToOne(() => Wish, (wish) => wish.listWishes)
  wish: Wish;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;
}
