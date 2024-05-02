import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { Wish } from '../../wish/entities/wish.entity';
import { List } from './list.entity';
import { IListWishEntity } from '../typing/interfaces/list-wish.entity.interface';

@Entity({ name: 'list_wish' })
export class ListWish implements IListWishEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => List, (list) => list.listWishes)
  list?: List;

  @Column()
  listId: number;

  @ManyToOne(() => Wish, (wish) => wish.listWishes)
  wish?: Wish;

  @Column()
  wishId: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;
}
