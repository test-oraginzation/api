import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDtoSignIn } from './dto/auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
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

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  refresh(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }
}
