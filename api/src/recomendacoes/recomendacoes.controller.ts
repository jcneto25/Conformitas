import { Controller, Get, Post, Patch, Param, Body, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { RecomendacoesService } from './recomendacoes.service';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser extends Request {
  user: { sub: string; email: string; roles: string[]; unidadeEscopo?: string | null };
}

// ── POST /relatorios/:id/recomendacoes (RF-008.1) ──
@ApiTags('recomendacoes')
@ApiBearerAuth()
@Controller('relatorios')
export class RecomendacoesRelatorioController {
  constructor(private readonly service: RecomendacoesService) {}

  @Post(':id/recomendacoes')
  @Roles('P01')
  @ApiOperation({ summary: 'Emitir recomendação vinculada ao Relatório Final (P01)' })
  criar(@Param('id') relatorioId: string, @Body() body: any) {
    return this.service.criar(relatorioId, body);
  }
}

// ── /recomendacoes (workflow + monitoramento) ──
@ApiTags('recomendacoes')
@ApiBearerAuth()
@Controller('recomendacoes')
export class RecomendacoesController {
  constructor(private readonly service: RecomendacoesService) {}

  @Get()
  @Roles('P01', 'P02', 'P05', 'P06')
  @ApiOperation({ summary: 'Listar recomendações (filtros: status, criticidade, auditoriaId)' })
  findAll(@Query() query: any, @Req() req: RequestWithUser) {
    return this.service.findAll(query, req.user?.unidadeEscopo);
  }

  @Get(':id')
  @Roles('P01', 'P02', 'P05', 'P06')
  @ApiOperation({ summary: 'Detalhar recomendação' })
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.service.findOne(id, req.user?.unidadeEscopo);
  }

  @Patch(':id')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Atualizar recomendação (P01, P02)' })
  atualizar(@Param('id') id: string, @Body() body: any) {
    return this.service.atualizar(id, body);
  }

  @Post(':id/providencias')
  @Roles('P05')
  @ApiOperation({ summary: 'Registrar providência da unidade auditada (P05)' })
  criarProvidencia(@Param('id') id: string, @Body() body: any) {
    return this.service.criarProvidencia(id, body);
  }

  @Post(':id/validar')
  @Roles('P02')
  @ApiOperation({ summary: 'P02 valida implementação → CUMPRIDA' })
  validar(@Param('id') id: string) {
    return this.service.validar(id);
  }
}
