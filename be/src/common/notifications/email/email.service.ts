import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { AuthService } from 'src/domain/auth/auth.service';
import AccountVerificationEmail from './templates/verify';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    if (config.get('auth.enableEmailNotification')) {
      this.resend = new Resend(config.get('external.resendApiKey'));
    }
  }

  async sendVerificationLinkTo(email: string) {
    try {
      const verificationLink = await this.authService.generateVerificationLink(email);

      if (!this.config.get('auth.enableEmailNotification')) {
        this.logger.log('Your verification link is: ' + verificationLink);
        return;
      }

      await this.resend.emails.send({
        from: this.config.get('external.resendSenderEmail'),
        to: email,
        subject: 'Verify your account',
        react: AccountVerificationEmail({verificationLink}), 
      });

      this.logger.log('Email has been sent to ' + email + ' from resend.');
      return;

    } catch (e) {
      this.logger.error(e);
    }
  }
}
