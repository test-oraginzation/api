import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserServiceRest } from '../../user/user.service';
import { User } from '../../../domain/user/entities/user.entity';
import { AuthGuardInterface } from '../typing/interfaces/guards/auth.guard.interface';

class TokenPayLoad {
  nickname: string;
  email: string;
  id: number;
}

@Injectable()
export class AuthGuard implements CanActivate, AuthGuardInterface {
  constructor(
    private jwtService: JwtService,
    private userServiceRest: UserServiceRest,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload: TokenPayLoad = this.jwtService.verify(token);

      const userExists: User = await this.userServiceRest.getOne(payload.id);
      if (!userExists) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!request.user) {
        request.user = {};
      }

      request.user.id = payload.id;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
