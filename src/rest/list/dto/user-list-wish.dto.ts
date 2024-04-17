import { Wish } from '../../../domain/wish/entities/wish.entity';

export class CreateUserListWishDto {
  userId: number;
  wishes: Wish[];
  listId: number;
}

export class UserListWishDto {
  id: number;
  name: string;
  description: string;
  wishes: Wish[];
  photo?: string;
  private?: boolean;
}
