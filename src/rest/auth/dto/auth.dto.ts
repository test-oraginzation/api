import { ApiProperty } from '@nestjs/swagger';

export class AuthDtoSignIn {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  password: string;
}

export class AuthDtoSignUp {
  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  phone: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  birthday: Date;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  photo: string;
}
