import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from '../dto/send-email.dto';
import Mail from 'nodemailer/lib/mailer';
import * as process from 'process';

@Injectable()
export class MailerService {
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
      const result = await this.mailTransport().sendMail(mailOptions);
      console.log(result);
      return result;
    } catch (e) {
      console.log(`error: ${e}`);
    }
  }
}
