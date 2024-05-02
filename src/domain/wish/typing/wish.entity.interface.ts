import { User } from '../../user/entities/user.entity';
import { ListWish } from '../../list/entities/list-wish.entity';

export interface IWishEntity {
  id: number;
  name: string;
  currency: string;
  price: number;
  url: string;
  description: string;
  photo: string;
  private: boolean;
  user?: User;
  userId: number;
  listWishes: ListWish[];
  updatedDate: Date;
  createdDate: Date;
}
