import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RecomendacoesService } from './recomendacoes.service';

@ApiTags('recomendacoes')
@Controller('recomendacoes')
export class RecomendacoesController {
  constructor(private readonly service: RecomendacoesService) {}
  @Get() @ApiOperation({ summary: 'Listar recomendações' }) findAll() {
    return this.service.findAll();
  }
}
