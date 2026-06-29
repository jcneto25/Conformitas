import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecomendacoesService } from './recomendacoes.service';

// ── POST /relatorios/:id/recomendacoes (RF-008.1) ──
// Role: P01
@ApiTags('recomendacoes')
@ApiBearerAuth()
@Controller('relatorios')
export class RecomendacoesRelatorioController {
  constructor(private readonly service: RecomendacoesService) {}

  @Post(':id/recomendacoes')
  @ApiOperation({ summary: 'Emitir recomendação vinculada ao Relatório Final (P01)' })
  criar(@Param('id') relatorioId: string, @Body() body: any) {
    return this.service.criar(relatorioId, body);
  }
}

// ── /recomendacoes (workflow + monitoramento) ──
// Role: P01/P02/P05/P06 (P05 escopo unidade)
@ApiTags('recomendacoes')
@ApiBearerAuth()
@Controller('recomendacoes')
export class RecomendacoesController {
  constructor(private readonly service: RecomendacoesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar recomendações (filtros: status, criticidade, auditoriaId)' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar recomendação' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar recomendação (P05: status/providências)' })
  atualizar(@Param('id') id: string, @Body() body: any) {
    return this.service.atualizar(id, body);
  }

  @Post(':id/providencias')
  @ApiOperation({ summary: 'Registrar providência da unidade auditada (P05)' })
  criarProvidencia(@Param('id') id: string, @Body() body: any) {
    return this.service.criarProvidencia(id, body);
  }

  @Post(':id/validar')
  @ApiOperation({ summary: 'P02 valida implementação → CUMPRIDA' })
  validar(@Param('id') id: string) {
    return this.service.validar(id);
  }
}
