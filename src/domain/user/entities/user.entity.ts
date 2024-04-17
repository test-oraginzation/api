import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Wish } from '../../wish/entities/wish.entity';
import { List } from '../../list/entities/list.entity';
import { Follow } from '../../follow/entities/follow.entity';
import { UserListWish } from '../../user-list-wish/entities/user-list-wish.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    type: 'text',
  })
  name: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  surname: string;

  @Column({
    nullable: false,
    type: 'text',
    unique: true,
  })
  nickname: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: true,
    type: 'decimal',
  })
  phone: number;

  @Column({
    nullable: true,
    type: 'date',
  })
  birthday: Date;

  @Column({
    nullable: true,
  })
  photo: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  gender: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  country: string;

  @OneToMany(() => Follow, (follow) => follow.follower)
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followings: Follow[];

  @OneToMany(() => Wish, (wish) => wish.user)
  wishes: Wish[];

  @OneToMany(() => List, (list) => list.user)
  lists: List[];

  @OneToMany(() => UserListWish, (userListWish) => userListWish.user)
  userListWishes: UserListWish[];

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
