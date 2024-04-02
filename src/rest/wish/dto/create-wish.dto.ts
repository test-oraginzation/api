import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWishDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  url: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  photo: string;

  @ApiPropertyOptional()
  private: boolean;
}
