import { Controller, Get, Post, Param, Body, Query, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RelatoriosService } from './relatorios.service';
import { RelatorioPdfService } from './relatorio-pdf.service';

// ── POST /auditorias/:id/relatorios (RF-007.1 / RF-007.2) ──
// Role: P01, P02
@ApiTags('relatorios')
@ApiBearerAuth()
@Controller('auditorias')
export class RelatoriosAuditoriaController {
  constructor(private readonly service: RelatoriosService) {}

  @Post(':id/relatorios')
  @ApiOperation({ summary: 'Gerar Relatório Preliminar/Final de auditoria (P01, P02)' })
  gerar(@Param('id') auditoriaId: string, @Body() body: { tipo: 'PRELIMINAR' | 'FINAL'; autorId: string }) {
    return this.service.gerar(auditoriaId, body);
  }
}

// ── /relatorios (RF-007.5 assinatura + consultas) ──
// Role: P01 (assinar), P01/P02/P05 (consultar — P05 escopo unidade)
@ApiTags('relatorios')
@ApiBearerAuth()
@Controller('relatorios')
export class RelatoriosController {
  constructor(
    private readonly service: RelatoriosService,
    private readonly pdfService: RelatorioPdfService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar relatórios (filtros: auditoriaId, tipo, status)' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar relatório' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/assinar')
  @ApiOperation({ summary: 'P01 assina Relatório Final (RASCUNHO → ASSINADO)' })
  assinar(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.service.assinar(id, body.userId);
  }

  @Get(':id/pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="relatorio.pdf"')
  @ApiOperation({ summary: 'Baixar relatório em PDF (T-085)' })
  async pdf(@Param('id') id: string) {
    const relatorio = await this.service.findOne(id);
    return this.pdfService.gerarPdf(relatorio);
  }
}

// ── POST /relatorios-anuais (RF-007.4) ──
// Role: P01
@ApiTags('relatorios')
@ApiBearerAuth()
@Controller('relatorios-anuais')
export class RelatoriosAnuaisController {
  constructor(private readonly service: RelatoriosService) {}

  @Post()
  @ApiOperation({ summary: 'Gerar Relatório Anual de Atividades (P01)' })
  gerar(@Body() body: { ano: number; autorId: string }) {
    return this.service.gerarAnual(body.ano, body.autorId);
  }
}
