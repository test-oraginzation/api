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
    private userService: UserServiceRest,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async singUp(data: CreateUserDto) {
    const user: User = await this.userService.create(data);
    console.log(user);
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  async signIn(data: AuthDtoSignIn) {
    const user: User = await this.validateUser(data);
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  async generateAccessToken(user: User) {
    const payload = { nickname: user.nickname, email: user.email, id: user.id };
    return this.jwtService.sign(payload, { expiresIn: '2d' });
  }

  async generateRefreshToken(user: User) {
    const payload = { id: user.id };
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  private async validateUser(data: AuthDtoSignIn) {
    const user: User = await this.userService.findByNickname(data.nickname);
    if (user) {
      const passwordEquals = await bcrypt.compare(data.password, user.password);
      if (passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({ message: 'Invalid email or password' });
  }

  async refreshToken(userId: number) {
    const user = await this.userService.getOne(userId);
    if (!user) {
      throw new UnauthorizedException({ message: 'Login again' });
    }
    return this.generateAccessToken(user);
  }

  async forgotPassword(email: string) {
    const user: User = await this.userService.findByEmail(email);
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
      html: `<html>\n      <head>\n        <title>Reset Password</title>\n      </head>\n      <body>\n        <h1>Reset Password</h1>\n        <p>Hello, ${user.nickname}!</p>\n        <p>Click the following link to reset your password: </p>\n        <a href="http://localhost:${process.env.PORT ?? 3000}/reset-password?token=${token}">Reset Password</a>\n  <p>, token: ${token}</p>\n     <p>If you did not request this, please ignore this email.</p>\n      </body>\n    </html>`,
    };
    return await this.mailerService.sendEmail(data);
  }

  async resetPassword(userId: number, password: string) {
    return await this.userService.updatePassword(userId, password);
  }
}

//TODO TEMPLATE JSON
// "name": "John",
//   "surname": "Doe",
//   "nickname": "johndoe",
//   "email": "john.doe@example.com",
//   "password": "mypassword",
//   "phone": 1234567890,
//   "birthday": "1990-01-01",
//   "gender": "male",
//   "country": "USA"
