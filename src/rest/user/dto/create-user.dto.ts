import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  surname?: string;

  @ApiProperty()
  nickname: string;

  @ApiPropertyOptional({
    description: '380000000000',
  })
  phone?: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
  })
  birthday?: Date;

  @ApiPropertyOptional()
  gender?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'url',
  })
  photo?: string;
}
