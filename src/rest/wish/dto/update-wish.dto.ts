import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWishDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  currency?: string;

  @ApiPropertyOptional()
  price?: number;

  @ApiPropertyOptional()
  url?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  photo?: string;

  @ApiPropertyOptional()
  private?: boolean;
}
