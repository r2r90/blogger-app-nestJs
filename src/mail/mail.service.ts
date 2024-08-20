import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRegistrationConfirmationCode(
    receiverEmail: string,
    confirmCode: string,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: receiverEmail,
        subject: 'Registration Confirmation Code',
        html: `<h1>Thank you for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href="https://blogger-app-nest-js.vercel.app/auth/registration-confirmation?code=${confirmCode}">complete registration</a>
 </p>`,
      });

      return true;
    } catch (e) {
      console.log('Error sending email:', e);
      return false;
    }
  }
}
