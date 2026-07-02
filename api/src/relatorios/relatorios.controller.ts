import { Controller, Get, Post, Param, Body, Query, Header, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { RelatoriosService } from './relatorios.service';
import { RelatorioPdfService } from './relatorio-pdf.service';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser extends Request {
  user: { sub: string; email: string; roles: string[]; unidadeEscopo?: string | null };
}

// ── POST /auditorias/:id/relatorios (RF-007.1 / RF-007.2) ──
@ApiTags('relatorios')
@ApiBearerAuth()
@Controller('auditorias')
export class RelatoriosAuditoriaController {
  constructor(private readonly service: RelatoriosService) {}

  @Post(':id/relatorios')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Gerar Relatório Preliminar/Final de auditoria (P01, P02)' })
  gerar(@Param('id') auditoriaId: string, @Body() body: { tipo: 'PRELIMINAR' | 'FINAL'; autorId: string }) {
    return this.service.gerar(auditoriaId, body);
  }
}

// ── /relatorios (RF-007.5 assinatura + consultas) ──
@ApiTags('relatorios')
@ApiBearerAuth()
@Controller('relatorios')
export class RelatoriosController {
  constructor(
    private readonly service: RelatoriosService,
    private readonly pdfService: RelatorioPdfService,
  ) {}

  @Get()
  @Roles('P01', 'P02', 'P05')
  @ApiOperation({ summary: 'Listar relatórios (filtros: auditoriaId, tipo, status)' })
  findAll(@Query() query: any, @Req() req: RequestWithUser) {
    return this.service.findAll(query, req.user?.unidadeEscopo);
  }

  @Get(':id')
  @Roles('P01', 'P02', 'P05')
  @ApiOperation({ summary: 'Detalhar relatório' })
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.service.findOne(id, req.user?.unidadeEscopo);
  }

  @Post(':id/assinar')
  @Roles('P01')
  @ApiOperation({ summary: 'P01 assina Relatório Final (RASCUNHO → ASSINADO)' })
  assinar(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.service.assinar(id, body.userId);
  }

  @Get(':id/pdf')
  @Roles('P01', 'P02', 'P05')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="relatorio.pdf"')
  @ApiOperation({ summary: 'Baixar relatório em PDF (T-085)' })
  async pdf(@Param('id') id: string, @Req() req: RequestWithUser) {
    const relatorio = await this.service.findOne(id, req.user?.unidadeEscopo);
    return this.pdfService.gerarPdf(relatorio);
  }
}

// ── POST /relatorios-anuais (RF-007.4) ──
@ApiTags('relatorios')
@ApiBearerAuth()
@Controller('relatorios-anuais')
export class RelatoriosAnuaisController {
  constructor(private readonly service: RelatoriosService) {}

  @Post()
  @Roles('P01')
  @ApiOperation({ summary: 'Gerar Relatório Anual de Atividades (P01)' })
  gerar(@Body() body: { ano: number; autorId: string }) {
    return this.service.gerarAnual(body.ano, body.autorId);
  }
}
