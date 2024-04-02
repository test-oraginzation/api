import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty({
    description: '380000000000',
  })
  phone: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({
    example: '1990-01-01',
  })
  birthday: Date;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  country: string;

  @ApiProperty({
    description: 'url',
  })
  photo: string;
}
