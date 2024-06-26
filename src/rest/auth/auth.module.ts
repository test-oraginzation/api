import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../user/users.module';
import { AuthGuard } from './guards/auth.guard';
import { MailerModule } from '../../libs/mailer/mailer.module';
@Module({
  imports: [forwardRef(() => UsersModule), MailerModule],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthGuard],
})
export class AuthModule {}
