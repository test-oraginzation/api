import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWishDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  url?: string;

  @ApiProperty()
  description?: string;

  @ApiPropertyOptional()
  photo?: string;

  @ApiPropertyOptional()
  private?: boolean = false;
}

export class WishesDto {
  @ApiProperty()
  wishes: WishDto[];
}

export class WishDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  photo: string;

  @ApiProperty()
  private: boolean = false;

  @ApiProperty()
  updatedDate: Date;

  @ApiProperty()
  createdDate: Date;
}
