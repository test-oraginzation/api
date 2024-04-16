import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Wish } from '../../wish/entities/wish.entity';
import { List } from '../../list/entities/list.entity';

@Entity({ name: 'user_list_wish' })
export class UserListWish {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userListWishes)
  user: User;

  @ManyToOne(() => List, (list) => list.userListWishes)
  list: List;

  @ManyToOne(() => Wish, (wish) => wish.userListWishes)
  wish: Wish;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;
}
