import { env } from "src/common/utils/env";

export const external = {
  resendApiKey: env('RESEND_API_KEY'),
  resendSenderEmail: env('RESEND_SENDER_EMAIL', 'info@abhinasregmi.com.np'),
};