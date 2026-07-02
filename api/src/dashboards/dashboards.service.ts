import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';

@Injectable()
export class DashboardsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Dashboard PAA: planejado × executado ────────────────
  async dashboardPaa(filters?: DashboardFilterDto) {
    const ano = filters?.ano ?? 2026;
    const planos = await this.prisma.planoAuditoria.findMany({
      where: { deletedAt: null, anoInicio: { lte: ano }, anoFim: { gte: ano } },
      include: { itensPlano: true, forcTrabalho: true },
    });

    const totalPlanos = planos.length;
    const planosAprovados = planos.filter((p) => p.status === 'APROVADO' || p.status === 'PUBLICADO').length;
    const totalHorasDisponiveis = planos.reduce(
      (acc, p) => acc + p.forcTrabalho.reduce((s, f) => s + f.horasDisponiveisAno, 0), 0);
    const totalHorasAlocadas = planos.reduce(
      (acc, p) => acc + p.forcTrabalho.reduce((s, f) => s + f.horasAlocadasAuditoria, 0), 0);

    // Auditorias executadas no período
    const filtroAuditoria: any = { deletedAt: null };
    if (filters?.periodoInicio || filters?.periodoFim) {
      filtroAuditoria.dataFimReal = {};
      if (filters.periodoInicio) filtroAuditoria.dataFimReal.gte = new Date(filters.periodoInicio);
      if (filters.periodoFim) filtroAuditoria.dataFimReal.lte = new Date(filters.periodoFim);
    }

    const auditorias = await this.prisma.auditoria.findMany({
      where: filtroAuditoria,
      select: { id: true, status: true, tipo: true, dataFimReal: true },
    });

    const auditoriasConcluidas = auditorias.filter((a) => a.status === 'CONCLUIDA').length;

    return {
      totalPlanos,
      planosAprovados,
      totalHorasDisponiveis,
      totalHorasAlocadas,
      auditoriasConcluidas,
      planejamentoPercentual: totalHorasDisponiveis > 0
        ? Math.round((totalHorasAlocadas / totalHorasDisponiveis) * 100)
        : 0,
    };
  }

  // ── Dashboard Execução: auditorias por status, tipo, unidade ──
  async dashboardExecucao(filters?: DashboardFilterDto) {
    const where: any = { deletedAt: null };
    if (filters?.periodoInicio || filters?.periodoFim) {
      where.dataInicio = {};
      if (filters.periodoInicio) where.dataInicio.gte = new Date(filters.periodoInicio);
      if (filters.periodoFim) where.dataInicio.lte = new Date(filters.periodoFim);
    }
    if (filters?.unidade) where.unidadeAuditada = filters.unidade;

    const auditorias = await this.prisma.auditoria.findMany({ where });
    const total = auditorias.length;

    // Por status
    const porStatus: Record<string, number> = {};
    const porTipo: Record<string, number> = {};
    const porUnidade: Record<string, number> = {};

    for (const a of auditorias) {
      porStatus[a.status] = (porStatus[a.status] ?? 0) + 1;
      porTipo[a.tipo] = (porTipo[a.tipo] ?? 0) + 1;
      if (a.unidadeAuditada) porUnidade[a.unidadeAuditada] = (porUnidade[a.unidadeAuditada] ?? 0) + 1;
    }

    return { total, porStatus, porTipo, porUnidade };
  }

  // ── Dashboard Recomendações: status, criticidade, vencidas ──
  async dashboardRecomendacoes(filters?: DashboardFilterDto) {
    const where: any = {};
    if (filters?.periodoInicio || filters?.periodoFim) {
      where.createdAt = {};
      if (filters.periodoInicio) where.createdAt.gte = new Date(filters.periodoInicio);
      if (filters.periodoFim) where.createdAt.lte = new Date(filters.periodoFim);
    }

    const recomendacoes = await this.prisma.recomendacao.findMany({ where });
    const total = recomendacoes.length;

    const porStatus: Record<string, number> = {};
    const porCriticidade: Record<string, number> = {};
    let vencidas = 0;
    const agora = new Date();

    for (const r of recomendacoes) {
      porStatus[r.status] = (porStatus[r.status] ?? 0) + 1;
      porCriticidade[r.criticidade] = (porCriticidade[r.criticidade] ?? 0) + 1;
      if (r.status !== 'CUMPRIDA' && r.prazo < agora) vencidas++;
    }

    return {
      total,
      porStatus,
      porCriticidade,
      vencidas,
      noPrazo: total - vencidas,
    };
  }

  // ── Dashboard Qualidade: indicadores PQAUD ────────────────
  async dashboardQualidade(filters?: DashboardFilterDto) {
    const whereAvaliacao: any = {};
    if (filters?.periodoInicio || filters?.periodoFim) {
      whereAvaliacao.createdAt = {};
      if (filters.periodoInicio) whereAvaliacao.createdAt.gte = new Date(filters.periodoInicio);
      if (filters.periodoFim) whereAvaliacao.createdAt.lte = new Date(filters.periodoFim);
    }

    const avaliacoes = await this.prisma.avaliacaoQualidade.findMany({
      where: whereAvaliacao,
      include: { naoConformidades: true },
    });

    const totalAvaliacoes = avaliacoes.length;
    const avaliacoesConcluidas = avaliacoes.filter((a) => a.status === 'CONCLUIDA').length;
    const mediaNota = avaliacoesConcluidas > 0
      ? Math.round(
          (avaliacoes.filter((a) => a.status === 'CONCLUIDA' && a.nota != null)
            .reduce((acc, a) => acc + (a.nota ?? 0), 0) /
          avaliacoesConcluidas) * 100
        ) / 100
      : null;

    const totalNc = avaliacoes.reduce((acc, a) => acc + a.naoConformidades.length, 0);
    const ncAbertas = avaliacoes.reduce(
      (acc, a) => acc + a.naoConformidades.filter((nc) => nc.status !== 'CORRIGIDA').length, 0);

    const indicadores = await this.prisma.indicadorQualidade.findMany();

    return {
      totalAvaliacoes,
      avaliacoesConcluidas,
      mediaNota,
      totalNaoConformidades: totalNc,
      naoConformidadesAbertas: ncAbertas,
      indicadores,
    };
  }

  // ── Export aggregation (summary data for PDF/XLSX) ────────
  async exportSummary(tipo: string, formato: string, filters?: DashboardFilterDto) {
    let data: any;
    switch (tipo) {
      case 'paa':
        data = await this.dashboardPaa(filters);
        break;
      case 'execucao':
        data = await this.dashboardExecucao(filters);
        break;
      case 'recomendacoes':
        data = await this.dashboardRecomendacoes(filters);
        break;
      case 'qualidade':
        data = await this.dashboardQualidade(filters);
        break;
      default:
        throw new BadRequestException(`Tipo de dashboard inválido: ${tipo}`);
    }

    return {
      tipo,
      formato,
      geradoEm: new Date().toISOString(),
      filtros: filters ?? {},
      dados: data,
    };
  }
}
