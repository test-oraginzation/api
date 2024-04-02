import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateListDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  photo: string;

  @ApiProperty()
  private: boolean;

  @ApiPropertyOptional()
  wishesIds: number[];
}
