import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { AuthDtoSignIn } from '../../dto/auth.dto';

export interface AuthControllerInterface {
  signUp(data: CreateUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  singIn(authDto: AuthDtoSignIn): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  refresh(req: Request): Promise<{ accessToken: string }>;
  forgotPassword(email: string): Promise<any>;
  resetPassword(req: Request, password: string): Promise<string>;
}
