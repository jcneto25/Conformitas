import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  IRelatorioRepository,
  RELATORIO_REPOSITORY,
  IRelatorioAnualRepository,
  RELATORIO_ANUAL_REPOSITORY,
} from './repositories/relatorio.repository';

const relatorioInclude = {
  auditoria: { include: { itemPlano: { include: { universo: true } } } },
  achados: { include: { manifestacoes: { orderBy: { createdAt: 'desc' as const } } } },
  recomendacoes: true,
};

@Injectable()
export class RelatoriosService {
  constructor(
    @Inject(RELATORIO_REPOSITORY) private readonly relRepo: IRelatorioRepository,
    @Inject(RELATORIO_ANUAL_REPOSITORY) private readonly anualRepo: IRelatorioAnualRepository,
  ) {}

  async gerar(auditoriaId: string, dto: any) {
    const auditoria = await this.relRepo.findUnique(auditoriaId);
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');
    if (auditoria.status !== 'EM_EXECUCAO' && auditoria.status !== 'CONCLUIDA') throw new BadRequestException('Auditoria deve estar EM_EXECUCAO ou CONCLUIDA para gerar relatório');
    const achados = await this.relRepo.findMany({ where: { auditoriaId } });
    return dto.tipo === 'FINAL'
      ? this.gerarFinal(auditoriaId, dto.autorId, achados)
      : this.gerarPreliminar(auditoriaId, dto.autorId, achados);
  }

  private async gerarPreliminar(auditoriaId: string, autorId: string, achados: any[]) {
    return this.relRepo.create({
      auditoriaId,
      tipo: 'PRELIMINAR',
      status: 'RASCUNHO',
      conteudo: `Relatório Preliminar — ${achados.length} achado(s)`,
      autorId,
    });
  }
  private async gerarFinal(auditoriaId: string, autorId: string, achados: any[]) {
    return this.relRepo.create({
      auditoriaId,
      tipo: 'FINAL',
      status: 'RASCUNHO',
      conteudo: `Relatório Final — ${achados.length} achado(s) consolidados`,
      autorId,
    });
  }

  async findOne(id: string, unidadeEscopo?: string | null) {
    const r = await this.relRepo.findUnique(id, { include: relatorioInclude });
    if (!r) throw new NotFoundException('Relatório não encontrado');
    return r;
  }
  async findAll(params?: any, unidadeEscopo?: string | null) {
    const where: any = {};
    if (params?.tipo) where.tipo = params.tipo;
    if (params?.status) where.status = params.status;
    if (params?.auditoriaId) where.auditoriaId = params.auditoriaId;
    if (unidadeEscopo) where.auditoria = { unidadeAuditada: unidadeEscopo };
    return this.relRepo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { auditoria: { select: { id: true, numero: true, unidadeAuditada: true } } },
    });
  }

  async assinar(id: string, userId: string) {
    const r = await this.relRepo.findUnique(id);
    if (!r) throw new NotFoundException('Relatório não encontrado');
    return this.relRepo.update(id, { status: 'ASSINADO', assinadoPor: userId, dataAssinatura: new Date() });
  }
  async gerarAnual(ano: number, autorId: string) {
    const existente = await this.anualRepo.findUnique({ where: { ano } });
    if (existente) throw new BadRequestException('Relatório anual já existe para este ano');
    return this.anualRepo.create({ ano, conteudo: `Relatório Anual ${ano}`, autorId });
  }
}
