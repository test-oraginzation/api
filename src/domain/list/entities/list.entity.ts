import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { ListWish } from './list-wish.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'lists' })
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'text',
  })
  name: string;

  @Column({
    nullable: false,
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

  @OneToMany(() => ListWish, (listWish) => listWish.list, {
    onDelete: 'CASCADE',
  })
  listWishes: ListWish[];

  @ManyToOne(() => User, (user) => user.lists)
  user: User;

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
