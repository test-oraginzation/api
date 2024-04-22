import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../domain/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthDtoSignIn } from './dto/auth.dto';
import { UserServiceRest } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { MailerService } from '../../libs/mailer/services/mailer.service';
import { SendEmailDto } from '../../libs/mailer/dto/send-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private userServiceRest: UserServiceRest,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async singUp(data: CreateUserDto) {
    await this.checkFields(data);
    const user: User = await this.userServiceRest.create(data);
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  async signIn(data: AuthDtoSignIn) {
    if (data.nickname !== null && data.password !== null) {
      const user: User = await this.validateUser(data);
      return {
        accessToken: await this.generateAccessToken(user),
        refreshToken: await this.generateRefreshToken(user),
      };
    } else {
      throw new HttpException('Send all data backlan!', HttpStatus.BAD_REQUEST);
    }
  }

  async generateAccessToken(user: User) {
    console.log('generating access token');
    const payload = { nickname: user.nickname, email: user.email, id: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '2d' });
    console.log(accessToken);
    return accessToken;
  }

  async generateRefreshToken(user: User) {
    const payload = { id: user.id };
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  private async validateUser(data: AuthDtoSignIn) {
    const user: User = await this.userServiceRest.findByNickname(data.nickname);
    if (user) {
      const passwordEquals = await bcrypt.compare(data.password, user.password);
      if (passwordEquals) {
        return user;
      }
    }
    throw new HttpException(
      'Invalid nickname or password',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async refreshToken(userId: number) {
    const user = await this.userServiceRest.getOne(userId);
    if (!user) {
      throw new UnauthorizedException({ message: 'Login again' });
    }
    const newAccessToken = await this.generateAccessToken(user);
    console.log(`refresh!: access token for user ${userId} generated`);
    return { accessToken: newAccessToken };
  }

  async forgotPassword(email: string) {
    const user: User = await this.userServiceRest.findByEmail(email);
    console.log(user);
    if (!user) {
      throw new HttpException(
        'User with this email not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const token = this.jwtService.sign({ id: user.id }, { expiresIn: '24h' });
    const data: SendEmailDto = {
      recipients: [
        {
          name: user.nickname,
          address: user.email,
        },
      ],
      subject: 'Reset password',
      html: `<html lang="en">\n      <head>\n        <title>Reset Password</title>\n      </head>\n      <body>\n        <h1>Reset Password</h1>\n        <p>Hello, ${user.nickname}!</p>\n        <p>Click the following link to reset your password: </p>\n        <a href="http://localhost:${process.env.PORT ?? 3000}/reset-password?token=${token}">Reset Password</a>\n  <p>, token: ${token}</p>\n     <p>If you did not request this, please ignore this email.</p>\n      </body>\n    </html>`,
    };
    return await this.mailerService.sendEmail(data);
  }

  async resetPassword(userId: number, password: string) {
    const user: User = await this.userServiceRest.updatePassword(
      userId,
      password,
    );
    if (!user) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return 'Successfully changed password';
  }

  private async checkFields(user: CreateUserDto) {
    if (!user.nickname) {
      throw new HttpException('Nickname needed', HttpStatus.BAD_REQUEST);
    } else if (!user.email) {
      throw new HttpException('Email needed', HttpStatus.BAD_REQUEST);
    } else if (!user.password) {
      throw new HttpException('Password needed', HttpStatus.BAD_REQUEST);
    } else if (!user.country) {
      throw new HttpException('Country needed', HttpStatus.BAD_REQUEST);
    }
  }
}
