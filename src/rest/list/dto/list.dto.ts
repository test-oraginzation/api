import { Wish } from '../../../domain/wish/entities/wish.entity';

export class ListDto {
  name: string;

  description: string;

  wishes: Wish[];

  photo?: string;

  private?: boolean;
}

export class CreateListDto {
  name: string;

  description: string;

  photo?: string;

  private?: boolean;
}

export class UpdateListDto {
  name?: string;

  description?: string;

  photo?: string;

  private?: boolean;
}
