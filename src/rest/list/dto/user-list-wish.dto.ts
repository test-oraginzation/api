import { Wish } from '../../../domain/wish/entities/wish.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  wishes?: Wish[];
  @ApiPropertyOptional()
  photo?: string;
  @ApiPropertyOptional()
  private?: boolean;
}

export class UpdateUserListWishDto {
  @ApiPropertyOptional()
  name?: string;
  @ApiPropertyOptional()
  description?: string;
  @ApiPropertyOptional()
  wishes?: Wish[];
  @ApiPropertyOptional()
  photo?: string;
  @ApiPropertyOptional()
  private?: boolean;
}

export class AddWishesToListDto {
  @ApiProperty()
  wishIds: number[];
}
