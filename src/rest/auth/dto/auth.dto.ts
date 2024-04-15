import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthDtoSignIn {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  password: string;
}

export class AuthDtoSignUp {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  surname?: string;

  @ApiProperty()
  nickname: string;

  @ApiPropertyOptional()
  phone?: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiPropertyOptional()
  birthday?: Date;

  @ApiPropertyOptional()
  gender?: string;

  @ApiProperty()
  country: string;

  @ApiPropertyOptional()
  photo?: string;
}

export class ForgotPasswordBodyDto {
  @ApiProperty()
  email: string;
}

export class ResetPasswordBodyDto {
  @ApiProperty()
  email: string;
}
