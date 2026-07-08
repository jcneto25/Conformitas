import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IDeclaracaoRepository,
  DECLARACAO_REPOSITORY,
  IImpedimentoRepository,
  IMPEDIMENTO_REPOSITORY,
  IClassificacaoRepository,
  CLASSIFICACAO_REPOSITORY,
  ILogSigilosoRepository,
  LOG_SIGILOSO_REPOSITORY,
} from './repositories/declaracao.repository';

@Injectable()
export class EticaService {
  constructor(
    @Inject(DECLARACAO_REPOSITORY) private readonly declRepo: IDeclaracaoRepository,
    @Inject(IMPEDIMENTO_REPOSITORY) private readonly impRepo: IImpedimentoRepository,
    @Inject(CLASSIFICACAO_REPOSITORY) private readonly classRepo: IClassificacaoRepository,
    @Inject(LOG_SIGILOSO_REPOSITORY) private readonly logRepo: ILogSigilosoRepository,
  ) {}

  async criarDeclaracao(usuarioId: string, dto: any) {
    return this.declRepo.create({ ...dto, usuarioId, dataDeclaracao: new Date() });
  }
  async listarDeclaracoes(usuarioId?: string) {
    const where: any = {};
    if (usuarioId) where.usuarioId = usuarioId;
    return this.declRepo.findMany({
      where,
      orderBy: { dataDeclaracao: 'desc' },
      include: { usuario: { select: { id: true, nome: true, email: true } } },
    });
  }
  async criarImpedimento(usuarioId: string, dto: any) {
    return this.impRepo.create({ ...dto, declaranteId: usuarioId });
  }
  async listarImpedimentos(auditoriaId?: string) {
    const where: any = {};
    if (auditoriaId) where.auditoriaId = auditoriaId;
    return this.impRepo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { declarante: { select: { id: true, nome: true } } },
    });
  }
  async aceitarImpedimento(id: string) {
    return this.impRepo.update(id, { aceito: true, dataDecisao: new Date() });
  }
  async classificarDocumento(entidadeTipo: string, entidadeId: string, classificadoPor: string, dto: any) {
    return this.classRepo.upsert(
      { entidadeTipo_entidadeId: { entidadeTipo, entidadeId } },
      { entidadeTipo, entidadeId, nivelSigilo: dto.nivelSigilo, justificativa: dto.justificativa, classificadoPor },
    );
  }
  async obterClassificacao(entidadeTipo: string, entidadeId: string) {
    return this.classRepo.findUnique({ where: { entidadeTipo_entidadeId: { entidadeTipo, entidadeId } } });
  }
  async listarTrilhaAcesso(entidadeTipo?: string, entidadeId?: string) {
    const where: any = {};
    if (entidadeTipo) where.entidadeTipo = entidadeTipo;
    if (entidadeId) where.entidadeId = entidadeId;
    return this.logRepo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { usuario: { select: { id: true, nome: true, email: true } } },
    });
  }
  async verificarAcessoSigiloso(usuarioId: string, entidadeTipo: string, entidadeId: string) {
    const classificacao = await this.obterClassificacao(entidadeTipo, entidadeId);
    const permitido = !classificacao || classificacao.nivelSigilo === 'PUBLICO';
    await this.logRepo.create({
      usuarioId,
      entidadeTipo,
      entidadeId,
      acao: permitido ? 'ACESSO_PERMITIDO' : 'ACESSO_NEGADO',
      nivelSigilo: classificacao?.nivelSigilo || 'PUBLICO',
    });
    return { permitido };
  }
  async verificarConflitos(usuarioId: string, unidadeAuditada: string) {
    return { conflitos: [] };
  }
}
