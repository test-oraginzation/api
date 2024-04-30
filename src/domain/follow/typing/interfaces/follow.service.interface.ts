import { Follow } from '../../entities/follow.entity';
import { User } from '../../../user/entities/user.entity';
import { DeleteResult } from 'typeorm';

export interface FollowServiceInterface {
  create(follow: Follow): Promise<Follow>;
  findAll(): Promise<Follow[]>;
  findOne(id: number): Promise<Follow>;
  findFollowing(userId: number): Promise<User[]>;
  findFollowers(userId: number): Promise<User[]>;
  checkFollow(followerId: number, followingId: number): Promise<Follow>;
  countFollowing(userId: number): Promise<number>;
  countFollowers(userId: number): Promise<number>;
  removeByFollowingId(followingId: number): Promise<DeleteResult>;
}
