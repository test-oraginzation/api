import { Address } from 'nodemailer/lib/mailer';

export class SendEmailDto {
  from?: Address;
  recipients: Address[];
  subject: string;
  html: string;
  text?: string;
  // placeholderReplacements?:
}
