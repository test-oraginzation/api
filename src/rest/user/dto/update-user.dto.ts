import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  surname?: string;

  @ApiPropertyOptional()
  nickname?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  password?: string;

  @ApiPropertyOptional()
  phone?: number;

  @ApiPropertyOptional()
  birthday?: Date;

  @ApiPropertyOptional()
  photo?: string;

  @ApiPropertyOptional()
  gender?: string;

  @ApiPropertyOptional()
  country?: string;
}
