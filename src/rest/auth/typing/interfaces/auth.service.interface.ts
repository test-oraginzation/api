import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { User } from '../../../../domain/user/entities/user.entity';
import { AuthDtoSignIn } from '../../dto/auth.dto';

export interface AuthServiceInterface {
  singUp(data: CreateUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  signIn(data: AuthDtoSignIn): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  generateAccessToken(user: User): Promise<string>;
  generateRefreshToken(user: User): Promise<string>;
  refreshToken(userId: number): Promise<{
    accessToken: string;
  }>;
  forgotPassword(email: string): Promise<any>;
  resetPassword(userId: number, password: string): Promise<string>;
}
