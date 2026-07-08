import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IDashboardRepository, DASHBOARD_REPOSITORY } from './repositories/dashboard.repository';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';

@Injectable()
export class DashboardsService {
  constructor(@Inject(DASHBOARD_REPOSITORY) private readonly repo: IDashboardRepository) {}

  async dashboardPaa(filters?: DashboardFilterDto) {
    const ano = filters?.ano ?? 2026;
    const planos = await this.repo.findPlanosAno(ano);
    const totalPlanos = planos.length;
    const planosAprovados = planos.filter((p: any) => p.status === 'APROVADO' || p.status === 'PUBLICADO').length;
    const totalHorasDisponiveis = planos.reduce(
      (acc: number, p: any) => acc + p.forcTrabalho.reduce((s: number, f: any) => s + f.horasDisponiveisAno, 0),
      0,
    );
    const totalHorasAlocadas = planos.reduce(
      (acc: number, p: any) => acc + p.forcTrabalho.reduce((s: number, f: any) => s + f.horasAlocadasAuditoria, 0),
      0,
    );
    const filtroAuditoria: any = { deletedAt: null };
    if (filters?.periodoInicio || filters?.periodoFim) {
      filtroAuditoria.createdAt = {};
      if (filters.periodoInicio) filtroAuditoria.createdAt.gte = new Date(filters.periodoInicio);
      if (filters.periodoFim) filtroAuditoria.createdAt.lte = new Date(filters.periodoFim);
    }
    const auditorias = await this.repo.findAuditorias(filtroAuditoria);
    return {
      ano,
      totalPlanos,
      planosAprovados,
      planosPendentes: totalPlanos - planosAprovados,
      totalHorasDisponiveis,
      totalHorasAlocadas,
      totalAuditorias: auditorias.length,
    };
  }

  async dashboardExecucao(filters?: DashboardFilterDto) {
    const filtro: any = { deletedAt: null };
    if (filters?.periodoInicio || filters?.periodoFim) {
      filtro.createdAt = {};
      if (filters.periodoInicio) filtro.createdAt.gte = new Date(filters.periodoInicio);
      if (filters.periodoFim) filtro.createdAt.lte = new Date(filters.periodoFim);
    }
    if (filters?.unidade) filtro.unidadeAuditada = filters.unidade;
    if (filters?.status) filtro.status = filters.status;
    const todas = await this.repo.findAuditorias(filtro);
    const porStatus: Record<string, number> = {};
    for (const a of todas) {
      porStatus[a.status] = (porStatus[a.status] || 0) + 1;
    }
    const atrasadas = filterAtrasadas(todas);
    return { total: todas.length, porStatus, atrasadas: atrasadas.length };
  }

  async dashboardRecomendacoes(filters?: DashboardFilterDto) {
    const filtro: any = {};
    if (filters?.status) filtro.status = filters.status;
    const recomendacoes = await this.repo.findRecomendacoes(filtro);
    const porStatus: Record<string, number> = {};
    for (const r of recomendacoes) {
      porStatus[r.status] = (porStatus[r.status] || 0) + 1;
    }
    const vencidas = recomendacoes.filter(
      (r: any) => r.status === 'PENDENTE' && r.prazo && new Date(r.prazo) < new Date(),
    );
    return { total: recomendacoes.length, porStatus, vencidas: vencidas.length };
  }

  async dashboardQualidade(filters?: DashboardFilterDto) {
    const filtro: any = {};
    if (filters?.periodoInicio) filtro.createdAt = { gte: new Date(filters.periodoInicio) };
    const avaliacoes = await this.repo.findAvaliacoesQualidade(filtro);
    const indicadores = await this.repo.findIndicadoresQualidade();
    const scoreMedio =
      avaliacoes.length > 0
        ? Math.round(avaliacoes.reduce((s: number, a: any) => s + (a.score || 0), 0) / avaliacoes.length)
        : 0;
    const naoConformidades = await this.repo.findNaoConformidades({});
    return {
      totalAvaliacoes: avaliacoes.length,
      scoreMedio,
      indicadores,
      naoConformidadesAbertas: naoConformidades.filter((n: any) => n.status !== 'CONCLUIDA').length,
    };
  }

  async exportSummary(tipo: string, formato: string, filters?: DashboardFilterDto) {
    let dados: any;
    switch (tipo) {
      case 'paa':
        dados = await this.dashboardPaa(filters);
        break;
      case 'execucao':
        dados = await this.dashboardExecucao(filters);
        break;
      case 'recomendacoes':
        dados = await this.dashboardRecomendacoes(filters);
        break;
      case 'qualidade':
        dados = await this.dashboardQualidade(filters);
        break;
      default:
        throw new BadRequestException(`Tipo inválido: ${tipo}`);
    }
    if (formato === 'json') return dados;
    throw new BadRequestException(`Formato não suportado: ${formato}`);
  }
}

function filterAtrasadas(auditorias: any[]): any[] {
  return auditorias.filter((a: any) => {
    if (a.status !== 'EM_EXECUCAO') return false;
    if (!a.dataFimPrevista) return false;
    return new Date(a.dataFimPrevista) < new Date();
  });
}
