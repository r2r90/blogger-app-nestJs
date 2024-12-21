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
     <a href="https://localhost:3000/auth/registration-confirmation?code=${confirmCode}" methods="POST">complete registration</a>
    
 </p>`,
      });

      return true;
    } catch (e) {
      console.log('Error sending email:', e);
      return false;
    }
  }

  async sendRecoveryCodeToUser(
    receiverEmail: string,
    recoveryCode: string,
  ): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: receiverEmail,
        subject: 'Password Recovery Code',
        html: `<h1>Password Recovery Code</h1>
 <p>To update your password please follow the link below: 
     <a href="https://localhost:3000/auth/password-recovery?code=${recoveryCode}" methods="POST">Change Password</a>
 </p>`,
      });
      return true;
    } catch (e) {
      console.log('Error sending email:', e);
      return false;
    }
  }
}
