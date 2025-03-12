import { env } from "src/common/env";

export default {
  port: env('DEFAULT_APP_PORT', 8000),
  docsTitle: 'Note Taking Application',
  docsDescription: 'A wonderful place for all your notes',
  docsPath: env('DEFAULT_DOCS_PATH', 'docs'),
  defaultVersion: env('DEFAULT_APP_VERSION', '1'),
};