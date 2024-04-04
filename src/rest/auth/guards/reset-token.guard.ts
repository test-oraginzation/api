import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface ForgotTokenPayLoad {
  id: number;
}

@Injectable()
export class ForgotPasswordGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid forgot password token');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);

      if (!request.user) {
        request.user = {};
      }

      request.user.id = payload.id;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid forgot password token');
    }
  }
}
