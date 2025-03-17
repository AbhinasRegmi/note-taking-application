import { Controller, Get } from '@nestjs/common';
import { PublicRoute } from './common/decorators/public.decorator';

@Controller({
  path: '/',
  version: '1',
})
export class AppController {
  @PublicRoute()
  @Get("/health")
  health() {
    return {
      ok: true,
    };
  }
}
