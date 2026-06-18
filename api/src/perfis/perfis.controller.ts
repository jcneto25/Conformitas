import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PerfisService } from './perfis.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('perfis')
@Controller('perfis')
export class PerfisController {
  constructor(private readonly service: PerfisService) {}

  @Get()
  @Roles('P10')
  @ApiOperation({ summary: 'Listar perfis (P10)' })
  findAll() {
    return this.service.findAll();
  }
}
