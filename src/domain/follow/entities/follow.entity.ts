import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { FollowEntityInterface } from '../typing/interfaces/follow.entity.interface';

@Entity({ name: 'follows' })
export class Follow implements FollowEntityInterface {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  follower: User;

  followerId: number;

  @ManyToOne(() => User, (user) => user.followings)
  following: User;

  followingId: number;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;
}
