import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardsService } from './dashboards.service';

@ApiTags('dashboards')
@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly service: DashboardsService) {}
  @Get() @ApiOperation({ summary: 'Dashboard PAA' }) findAll() {
    return this.service.findAll();
  }
}
