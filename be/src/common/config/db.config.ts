import { env } from "src/common/utils/env";

export const db = {
  url: env('DATABASE_URL'),
};