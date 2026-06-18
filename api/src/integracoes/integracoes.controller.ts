import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IntegracoesService } from './integracoes.service';

@ApiTags('integracoes')
@Controller('integracoes')
export class IntegracoesController {
  constructor(private readonly service: IntegracoesService) {}
  @Get() @ApiOperation({ summary: 'Listar integrações' }) findAll() { return this.service.findAll(); }
}
