import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateListDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  photo?: string;

  @ApiPropertyOptional()
  private?: boolean;

  @ApiPropertyOptional()
  wishesIds?: number[];
}
