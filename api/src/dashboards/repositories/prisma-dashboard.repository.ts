import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IDashboardRepository, DASHBOARD_REPOSITORY } from './dashboard.repository';

@Injectable()
export class PrismaDashboardRepository implements IDashboardRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findPlanosAno(ano: number) {
    return this.prisma.planoAuditoria.findMany({
      where: { deletedAt: null, anoInicio: { lte: ano }, anoFim: { gte: ano } },
      include: { itensPlano: true, forcTrabalho: true },
    });
  }
  async findAuditorias(filters: any) {
    return this.prisma.auditoria.findMany({ where: { deletedAt: null, ...filters }, include: { itemPlano: true } });
  }
  async findRecomendacoes(filters: any) {
    return this.prisma.recomendacao.findMany({
      where: filters,
      include: { relatorio: { include: { auditoria: true } } },
    });
  }
  async findAvaliacoesQualidade(filters: any) {
    return this.prisma.avaliacaoQualidade.findMany({ where: filters, include: { naoConformidades: true } });
  }
  async findIndicadoresQualidade() {
    return this.prisma.indicadorQualidade.findMany();
  }
  async findNaoConformidades(filters: any) {
    return this.prisma.naoConformidade.findMany({ where: filters });
  }
  async findForcaTrabalho(planoId: string) {
    return this.prisma.forcaTrabalho.findMany({ where: { planoId } });
  }
}
