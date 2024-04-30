import { Wish } from '../../../domain/wish/entities/wish.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListDto {
  name: string;

  description: string;

  wishes: Wish[];

  photo?: string;

  private?: boolean;
}

export class CreateListDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiPropertyOptional()
  photo?: string;
  @ApiPropertyOptional()
  private?: boolean;
}

export class CreateUserListWishDto {
  userId: number;
  wishes: Wish[];
  listId: number;
}

export class UserListWishDto {
  id?: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiPropertyOptional()
  wishIds?: number[];
  @ApiPropertyOptional()
  photo?: string;
  @ApiPropertyOptional()
  private?: boolean;
  @ApiPropertyOptional()
  updatedDate?: Date;
  @ApiPropertyOptional()
  createdDate?: Date;
}

export class UpdateListDto {
  @ApiPropertyOptional()
  name?: string;
  @ApiPropertyOptional()
  description?: string;
  @ApiPropertyOptional()
  photo?: string;
  @ApiPropertyOptional()
  private?: boolean;
}

export class UpdateWishesInListDto {
  @ApiProperty()
  wishIds: number[];
}
