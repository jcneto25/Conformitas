import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RelatoriosService } from './relatorios.service';

@ApiTags('relatorios')
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly service: RelatoriosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar relatórios' })
  findAll() {
    return this.service.findAll();
  }
}
