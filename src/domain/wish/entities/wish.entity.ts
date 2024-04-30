import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ListWish } from '../../list/entities/list-wish.entity';
import { WishEntityInterface } from '../typing/wish.entity.interface';

@Entity({ name: 'wishes' })
export class Wish implements WishEntityInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'text',
  })
  name: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  currency: string;

  @Column({
    nullable: false,
    type: 'decimal',
  })
  price: number;

  @Column({
    unique: false,
    nullable: true,
  })
  url: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  photo: string;

  @Column({
    default: false,
    type: 'boolean',
  })
  private: boolean;

  @ManyToOne(() => User, (user) => user.wishes)
  user?: User;

  userId: number;

  @OneToMany(() => ListWish, (listWish) => listWish.wish, {
    onDelete: 'CASCADE',
  })
  listWishes: ListWish[];

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;
}
