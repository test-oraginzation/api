import { ListWish } from '../../entities/list-wish.entity';
import { User } from '../../../user/entities/user.entity';

export interface ListEntityInterface {
  id: number;
  name: string;
  description: string;
  photo: string;
  private: boolean;
  listWishes?: ListWish[];
  userId: number;
  user?: User;
  updatedDate: Date;
  createdDate: Date;
}
