import { Controller, Get, Post, Param, Query, Res, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { DashboardsService } from './dashboards.service';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';
import { ExportFormato } from './dto/export-dashboard.dto';

const PDF_KIT_AVAILABLE = (() => { try { require.resolve('pdfkit'); return true; } catch { return false; }})();

@ApiTags('dashboards')
@Controller('dashboards')
@ApiBearerAuth()
export class DashboardsController {
  constructor(private readonly service: DashboardsService) {}

  @Get('paa')
  @Roles('P01', 'P02', 'P03')
  @ApiOperation({ summary: 'Dashboard PAA: planejado × executado' })
  dashboardPaa(@Query() filters?: DashboardFilterDto) {
    return this.service.dashboardPaa(filters);
  }

  @Get('execucao')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Dashboard Execução: auditorias por status, tipo, unidade' })
  dashboardExecucao(@Query() filters?: DashboardFilterDto) {
    return this.service.dashboardExecucao(filters);
  }

  @Get('recomendacoes')
  @Roles('P01', 'P02', 'P06')
  @ApiOperation({ summary: 'Dashboard Recomendações: status, criticidade, vencidas' })
  dashboardRecomendacoes(@Query() filters?: DashboardFilterDto) {
    return this.service.dashboardRecomendacoes(filters);
  }

  @Get('qualidade')
  @Roles('P01', 'P07')
  @ApiOperation({ summary: 'Dashboard Qualidade: indicadores PQAUD' })
  dashboardQualidade(@Query() filters?: DashboardFilterDto) {
    return this.service.dashboardQualidade(filters);
  }

  @Post('export/:tipo')
  @Roles('P01')
  @HttpCode(200)
  @ApiOperation({ summary: 'Exportar dashboard em PDF ou XLSX' })
  @ApiQuery({ name: 'formato', enum: ExportFormato, required: true })
  async export(
    @Param('tipo') tipo: string,
    @Query('formato') formato: ExportFormato,
    @Query() filters: DashboardFilterDto,
    @Res() res: Response,
  ) {
    const summary = await this.service.exportSummary(tipo, formato || 'PDF', filters);

    if (formato === 'PDF' && PDF_KIT_AVAILABLE) {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      const done = new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

      doc.fontSize(18).text(`Dashboard - ${tipo.toUpperCase()}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Gerado em: ${summary.geradoEm}`, { align: 'right' });
      doc.moveDown();
      doc.fontSize(12).text(JSON.stringify(summary.dados, null, 2));
      doc.end();

      const pdf = await done;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="dashboard-${tipo}.pdf"`);
      res.send(pdf);
    } else {
      // Sem PDFKit — retorna JSON formatado para fallback
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="dashboard-${tipo}.json"`);
      res.json(summary);
    }
  }

  @Get('health')
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Health check dos módulos de dashboard' })
  health() {
    return {
      status: 'ok',
      pdfDisponivel: PDF_KIT_AVAILABLE,
      timestamp: new Date().toISOString(),
    };
  }
}
