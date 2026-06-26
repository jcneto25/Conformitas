import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('health')
@Controller()
export class HealthController {
  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  check() {
    return { status: 'ok', timestamp: new Date().toISOString(), version: '0.1.0' };
  }
}
