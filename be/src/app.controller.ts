import { Controller, Get } from '@nestjs/common';
import { PublicRoute } from './common/decorators/public.decorator';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';

class HealthResponseDto {
  @ApiProperty({ type: 'boolean' })
  ok: boolean;
}

@Controller({
  path: '/',
  version: '1',
})
export class AppController {
  @ApiOperation({ description: 'Health check for the application.' })
  @ApiResponse({
    status: 200,
    description: 'ok response',
    type: HealthResponseDto,
  })
  @PublicRoute()
  @Get('/health')
  health() {
    return {
      ok: true,
    };
  }
}
