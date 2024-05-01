import { CreateFollowDto } from '../../dto/create-follow.dto';
import { Follow } from '../../../../domain/follow/entities/follow.entity';
import { DeleteResult } from 'typeorm';
import { User } from '../../../../domain/user/entities/user.entity';

export interface FollowServiceInterface {
  getAll(): Promise<Follow[]>;
  delete(userId: number, followingId: number): Promise<DeleteResult>;
  create(followerId: number, data: CreateFollowDto): Promise<Follow>;
  getFollowing(userId: number): Promise<User[]>;
  getFollowers(userId: number): Promise<User[]>;
  getFollowersCount(userId: number): Promise<number>;
  getFollowingCount(userId: number): Promise<number>;
  checkFollow(following: number): Promise<Follow>;
}
