import { env } from "../utils/env";

export const auth = {
  sessionTokenLength: 64,
  otpLength: 6,
  saltRounds: 10,
  secretKey: env('SECRET_KEY'),
  verificationExpiryMinutes: 10,
  verificationLinkBaseUrl: `${env('BASE_URL', 'http://localhost:8000')}/api/v1/auth/verify`,
  singleSignInToken: `${env('BASE_URL', 'http://localhost:8000')}/api/v1/auth/login/sst`,
  sendVerificatinLinkUrl: `${env('BASE_URL', 'http://localhost:8000')}/api/v1/auth/send/verification-link`,
  enableEmailNotification: env('ENABLE_EMAIL_NOTIFICATION', 'false') === 'true'
};