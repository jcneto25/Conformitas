import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UniversoService } from './universo.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('universo')
@Controller('universo-auditavel')
export class UniversoController {
  constructor(private readonly service: UniversoService) {}

  @Get()
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Listar universo auditável (P01, P02)' })
  findAll() {
    return this.service.findAll();
  }
}
