import { Follow } from '../../../follow/entities/follow.entity';
import { Wish } from '../../../wish/entities/wish.entity';
import { List } from '../../../list/entities/list.entity';

export interface UserEntityInterface {
  nickname: string;
  email: string;
  password: string;
  phone: number;
  birthday: Date;
  photo: string;
  gender: string;
  country: string;
  followers: Follow[];
  followings: Follow[];
  wishes: Wish[];
  lists: List[];
  updatedDate: Date;
  createdDate: Date;
}
