import { env } from "src/common/env";

export const db = {
  url: env('DATABASE_URL'),
};