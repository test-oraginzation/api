import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'wishes' })
export class Wish {
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
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;
}
