import { SendEmailDto } from '../../dto/send-email.dto';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Transporter } from 'nodemailer';

export interface MailerServiceInterface {
  mailTransport(): Transporter<SMTPTransport.SentMessageInfo>;
  sendEmail(data: SendEmailDto): Promise<SMTPTransport.SentMessageInfo>;
}
