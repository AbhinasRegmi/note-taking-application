import { env } from "../utils/env";

export const auth = {
  sessionTokenLength: 64,
  otpLength: 6,
  saltRounds: 10,
  secretKey: env('SECRET_KEY'),
};