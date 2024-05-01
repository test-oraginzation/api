import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuardInterface } from '../typing/interfaces/guards/auth.guard.interface';
import { LoggerService, LogLevel } from '../../../shared/logger/logger.service';

export interface ForgotTokenPayLoad {
  id: number;
}

@Injectable()
export class ResetTokenGuard implements CanActivate, AuthGuardInterface {
  constructor(
    private jwtService: JwtService,
    private logger: LoggerService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid reset password token');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);

      if (!request.user) {
        request.user = {};
      }

      request.user.id = payload.id;
      await this.logger.log(
        `trying to reset password`,
        payload.id,
        LogLevel.INFO,
      );
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid forgot password token');
    }
  }
}
