import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../domain/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthDtoSignIn, AuthDtoSignUp } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async singUp(data: CreateUserDto) {
    const user: User = await this.userService.create(data);
    console.log(user);
    return await this.generateAccessToken(user);
  }

  async signIn(data: AuthDtoSignIn) {
    const user: User = await this.validateUser(data);
    const token = await this.generateAccessToken(user);
    console.log(`token: ${token}`);
    return token;
  }

  async generateAccessToken(user: User) {
    const payload = { nickname: user.nickname, email: user.email, id: user.id };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(user: User) {
    const payload = { id: user.id };
    return this.jwtService.sign(payload);
  }

  private async validateUser(data: AuthDtoSignIn) {
    const user: User = await this.userService.findByNickname(data.nickname);
    console.log(user);
    if (user) {
      const passwordEquals = await bcrypt.compare(data.password, user.password);
      console.log(passwordEquals);
      console.log(data.password);
      console.log(user.password);
      if (passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({ message: 'Invalid email or password' });
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
