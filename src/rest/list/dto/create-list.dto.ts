import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Wish } from '../../../domain/wish/entities/wish.entity';

export class CreateListDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  wishes: Wish[];

  @ApiPropertyOptional()
  photo?: string;

  @ApiPropertyOptional()
  private?: boolean;
}
