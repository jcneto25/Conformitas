import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CapacitacoesService } from './capacitacoes.service';

@ApiTags('capacitacoes')
@Controller('capacitacoes')
export class CapacitacoesController {
  constructor(private readonly service: CapacitacoesService) {}
  @Get() @ApiOperation({ summary: 'Listar capacitações' }) findAll() { return this.service.findAll(); }
}
