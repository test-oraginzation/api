import { User } from '../../../user/entities/user.entity';

export interface FollowEntityInterface {
  id: number;
  follower?: User;
  followerId: number;
  following?: User;
  followingId: number;
  updated_at: Date;
  createdDate: Date;
}
