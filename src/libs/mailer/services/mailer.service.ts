import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from '../dto/send-email.dto';
import Mail from 'nodemailer/lib/mailer';
import * as process from 'process';
import { MailerServiceInterface } from '../typing/interfaces/mailer.service.interface';

@Injectable()
export class MailerService implements MailerServiceInterface {
  mailTransport() {
    return nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: Number(process.env.MAILER_PASSWORD),
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD,
      },
    });
  }

  async sendEmail(data: SendEmailDto) {
    const mailOptions: Mail.Options = {
      from: data.from ?? {
        name: process.env.APP_NAME,
        address: process.env.DEFAULT_MAIL_FROM,
      },
      to: data.recipients,
      subject: data.subject,
      html: data.html,
    };
    try {
      return await this.mailTransport().sendMail(mailOptions);
    } catch (e) {}
  }
}
