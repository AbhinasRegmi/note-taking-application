import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { AuthService } from 'src/domain/auth/auth.service';
import AccountVerificationEmail from './templates/verify';
import SingleLoginEmail from './templates/single-login';
import { OnEvent } from '@nestjs/event-emitter';

function sleepSync(ms) {
  const now = Atomics.load(new Int32Array(new SharedArrayBuffer(4)), 0);
  while (
    Atomics.load(new Int32Array(new SharedArrayBuffer(4)), 0) - now <
    ms
  ) {}
}

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

  @OnEvent('notification.email.sstlogin', {async: true})
  async sendSingleTimeLoginLinkTo(payload: { email: string }) {
    try {
      const singleLoginLink = await this.authService.generateVerificationLink(
        payload.email,
        'auth.singleSignInToken',
      );

      if (!this.config.get('auth.enableEmailNotification')) {
        this.logger.log('Your one time login link is: ' + singleLoginLink);
        return;
      }

      await this.resend.emails.send({
        from: this.config.get('external.resendSenderEmail'),
        to: payload.email,
        subject: 'One time login link',
        react: SingleLoginEmail({ loginLink: singleLoginLink }),
      });

      this.logger.log(
        'One time login email has been sent to ' +
          payload.email +
          ' from resend',
      );
      return;
    } catch (e) {
      this.logger.error(e);
    }
  }

  @OnEvent('notification.email.verify', {async: true})
  async sendVerificationLinkTo(payload: { email: string }) {
    try {
      const verificationLink = await this.authService.generateVerificationLink(
        payload.email,
      );

      if (!this.config.get('auth.enableEmailNotification')) {
        this.logger.log('Your verification link is: ' + verificationLink);
        return;
      }

      await this.resend.emails.send({
        from: this.config.get('external.resendSenderEmail'),
        to: payload.email,
        subject: 'Verify your account',
        react: AccountVerificationEmail({ verificationLink }),
      });

      this.logger.log(
        'Accout verification email has been sent to ' +
          payload.email +
          ' from resend.',
      );
      return;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
