import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IRecomendacaoRepository,
  RECOMENDACAO_REPOSITORY,
  IProvidenciaRepository,
  PROVIDENCIA_REPOSITORY,
} from './repositories/recomendacao.repository';

@Injectable()
export class RecomendacoesService {
  constructor(
    @Inject(RECOMENDACAO_REPOSITORY) private readonly recRepo: IRecomendacaoRepository,
    @Inject(PROVIDENCIA_REPOSITORY) private readonly provRepo: IProvidenciaRepository,
  ) {}

  async criar(relatorioId: string, dto: any) {
    return this.recRepo.create({ ...dto, relatorioId, status: 'PENDENTE' });
  }
  async findAll(params?: any, unidadeEscopo?: string | null) {
    const where: any = {};
    if (params?.status) where.status = params.status;
    if (params?.relatorioId) where.relatorioId = params.relatorioId;
    if (params?.prioridade) where.prioridade = params.prioridade;
    if (unidadeEscopo) where.relatorio = { auditoria: { unidadeAuditada: unidadeEscopo } };
    if (params?.search) {
      where.OR = [
        { descricao: { contains: params.search, mode: 'insensitive' } },
        { providencias: { some: { descricao: { contains: params.search, mode: 'insensitive' } } } },
      ];
    }
    return this.recRepo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        relatorio: { include: { auditoria: { select: { id: true, numero: true, unidadeAuditada: true } } } },
        providencias: { orderBy: { createdAt: 'desc' } },
      },
    });
  }
  async findOne(id: string, unidadeEscopo?: string | null) {
    const r = await this.recRepo.findUnique(id, {
      include: { relatorio: { include: { auditoria: true } }, providencias: { orderBy: { createdAt: 'desc' } } },
    });
    if (!r) throw new NotFoundException('Recomendação não encontrada');
    return r;
  }
  async atualizar(id: string, dto: any) {
    await this.findOne(id);
    return this.recRepo.update(id, dto);
  }
  async criarProvidencia(recomendacaoId: string, dto: any) {
    return this.provRepo.create({ ...dto, recomendacaoId });
  }
  async verificarVencidas() {
    const vencidas = await this.recRepo.findMany({ where: { status: 'PENDENTE', prazo: { lte: new Date() } } });
    for (const r of vencidas) await this.recRepo.update(r.id, { status: 'VENCIDA' });
    return { vencidas: vencidas.length };
  }
  async escalarVencidas() {
    const vencidas = await this.recRepo.findMany({ where: { status: 'VENCIDA', prioridade: 'ALTA' } });
    return { escaladas: vencidas.length };
  }
  async validar(id: string) {
    return this.recRepo.update(id, { validado: true });
  }
}
