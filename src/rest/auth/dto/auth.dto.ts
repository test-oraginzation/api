import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

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

  @ApiPropertyOptional()
  nickname?: string;

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
