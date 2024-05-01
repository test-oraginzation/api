import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthDtoSignIn,
  ForgotPasswordBodyDto,
  ResetPasswordBodyDto,
} from './dto/auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthControllerInterface } from './typing/interfaces/auth.controller.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController implements AuthControllerInterface {
  constructor(private authService: AuthService) {}
  @Post('sign-up')
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'sign up' })
  @ApiOkResponse({ description: 'Access, Refresh token' })
  signUp(@Body() data: CreateUserDto) {
    return this.authService.singUp(data);
  }

  @Post('sign-in')
  @ApiBody({ type: AuthDtoSignIn })
  @ApiOperation({ summary: 'sign in' })
  @ApiOkResponse({ description: 'Access, Refresh token' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid nickname or password',
  })
  singIn(@Body() authDto: AuthDtoSignIn) {
    return this.authService.signIn(authDto);
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('refresh token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({ description: 'Access token' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Login again' })
  refresh(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordBodyDto })
  @ApiOperation({ summary: 'Forgot password' })
  @ApiOkResponse({ description: 'Reset token to email' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User with this email not found',
  })
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiBody({ type: ResetPasswordBodyDto, description: 'token in email' })
  @ApiOperation({ summary: 'Reset token' })
  @ApiOkResponse({ description: 'Successfully changed password' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  resetPassword(@Request() req, @Body('password') password: string) {
    return this.authService.resetPassword(req.user.id, password);
  }
}
