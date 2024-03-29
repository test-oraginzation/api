import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Wish } from "../../wish/entities/wish.entity";
import { List } from "../../list/entities/list.entity";

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
    nullable: false,
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

  @OneToMany(() => Wish, (wish) => wish.user)
  wishes: Wish[];

  @OneToMany(() => List, (list) => list.owner)
  lists: List[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;
}
