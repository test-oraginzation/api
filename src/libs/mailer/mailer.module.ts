import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './services/mailer.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
