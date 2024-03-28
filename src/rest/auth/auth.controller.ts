import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDtoSignIn } from './dto/auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('sign-up')
  signUp(@Body() data: CreateUserDto) {
    return this.authService.singUp(data);
  }

  @Post('sign-in')
  singIn(@Body() authDto: AuthDtoSignIn) {
    return this.authService.signIn(authDto);
  }
}
