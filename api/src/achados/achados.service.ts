import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificacoesService } from '../notificacoes/notificacoes.service';
import { adicionarDiasUteis } from '../common/utils/dias-uteis';
import { CreateAchadoDto } from './dto/create-achado.dto';
import { CreateManifestacaoDto } from './dto/create-manifestacao.dto';

/** Prazo regulatório de manifestação da unidade auditada (RF-006.5). */
export const PRAZO_MANIFESTACAO_DIAS_UTEIS = 5;

/** Ressalva registrada quando o prazo de manifestação expira sem resposta (RF-006.5). */
export const RESSALVA_SEM_MANIFESTACAO =
  'Sem manifestação da unidade auditada no prazo regulatório (5 dias úteis).';

@Injectable()
export class AchadosService {
  private readonly logger = new Logger(AchadosService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificacoes: NotificacoesService,
  ) {}

  // ── Achados ───────────────────────────────────

  /**
   * Cria um achado vinculado a uma auditoria EM_EXECUCAO.
   * `auditoriaId` vem do path e `autorId` do JWT (não do corpo).
   */
  async create(auditoriaId: string, dto: CreateAchadoDto, autorId: string) {
    const auditoria = await this.prisma.auditoria.findUnique({
      where: { id: auditoriaId },
    });
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');
    if (auditoria.status !== 'EM_EXECUCAO') {
      throw new BadRequestException('Achados só podem ser criados em auditorias EM_EXECUCAO');
    }

    // Código sequencial por auditoria (ACH-1, ACH-2, ...)
    const count = await this.prisma.achadoAuditoria.count({
      where: { auditoriaId },
    });

    return this.prisma.achadoAuditoria.create({
      data: {
        auditoriaId,
        codigo: `ACH-${count + 1}`,
        tipo: dto.tipo,
        situacaoEncontrada: dto.situacaoEncontrada,
        criterio: dto.criterio,
        causa: dto.causa,
        efeito: dto.efeito,
        status: 'PRELIMINAR',
        evidenciaIds: dto.evidenciaIds ?? [],
        autorId,
      },
      include: this.achadoInclude,
    });
  }

  async findAll(
    params?: { status?: string; tipo?: string; auditoriaId?: string; search?: string },
    unidadeEscopo?: string | null,
  ) {
    const where: any = {};
    if (params?.status) where.status = params.status;
    if (params?.tipo) where.tipo = params.tipo;
    if (params?.auditoriaId) where.auditoriaId = params.auditoriaId;
    if (unidadeEscopo) {
      where.auditoria = { unidadeAuditada: unidadeEscopo };
    }
    if (params?.search) {
      where.OR = [
        { codigo: { contains: params.search } },
        { situacaoEncontrada: { contains: params.search, mode: 'insensitive' } },
        { criterio: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.achadoAuditoria.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        auditoria: { select: { id: true, numero: true, unidadeAuditada: true } },
        manifestacoes: { orderBy: { dataManifestacao: 'asc' } },
        _count: { select: { recomendacoes: true } },
      },
    });
  }

  /** Detalha um achado. Usuários com `unidadeEscopo` (P05) só acessam achados da própria unidade. */
  async findOne(id: string, unidadeEscopo?: string | null) {
    const achado = await this.prisma.achadoAuditoria.findUnique({
      where: { id },
      include: {
        auditoria: { select: { id: true, numero: true, unidadeAuditada: true } },
        manifestacoes: { orderBy: { dataManifestacao: 'asc' } },
        recomendacoes: true,
      },
    });
    if (!achado) throw new NotFoundException('Achado não encontrado');

    if (unidadeEscopo && achado.auditoria.unidadeAuditada !== unidadeEscopo) {
      throw new ForbiddenException('Achado fora do escopo da sua unidade');
    }
    return achado;
  }

  /** Edita um achado — apenas enquanto PRELIMINAR (após envio/consolidação fica imutável). */
  async update(id: string, dto: Partial<CreateAchadoDto>) {
    const achado = await this.findOne(id);
    if (achado.status !== 'PRELIMINAR') {
      throw new BadRequestException('Apenas achados PRELIMINAR podem ser editados');
    }
    return this.prisma.achadoAuditoria.update({
      where: { id },
      data: {
        ...(dto.tipo && { tipo: dto.tipo }),
        ...(dto.situacaoEncontrada && { situacaoEncontrada: dto.situacaoEncontrada }),
        ...(dto.criterio && { criterio: dto.criterio }),
        ...(dto.causa && { causa: dto.causa }),
        ...(dto.efeito && { efeito: dto.efeito }),
        ...(dto.evidenciaIds && { evidenciaIds: dto.evidenciaIds }),
      },
      include: this.achadoInclude,
    });
  }

  // ── Workflow ──────────────────────────────────

  /**
   * Envia o achado para manifestação da unidade auditada.
   * PRELIMINAR → EM_MANIFESTACAO, define prazo em DIAS ÚTEIS e notifica os
   * gestores (P05) da unidade (RF-006.3).
   */
  async enviarManifestacao(id: string, prazoDiasUteis: number = PRAZO_MANIFESTACAO_DIAS_UTEIS) {
    const achado = await this.findOne(id);
    if (achado.status !== 'PRELIMINAR') {
      throw new BadRequestException('Apenas achados PRELIMINAR podem ser enviados para manifestação');
    }
    if (prazoDiasUteis < 1) {
      throw new BadRequestException('prazoDiasUteis deve ser maior ou igual a 1');
    }

    const prazo = adicionarDiasUteis(new Date(), prazoDiasUteis);

    const atualizado = await this.prisma.achadoAuditoria.update({
      where: { id },
      data: {
        status: 'EM_MANIFESTACAO',
        prazoManifestacao: prazo,
      },
      include: this.achadoInclude,
    });

    await this.notificacoes.notificarGestoresUnidade(
      achado.auditoria.unidadeAuditada,
      'ACHADO_MANIFESTACAO',
      `Achado ${achado.codigo} aguarda manifestação da sua unidade. Prazo: ${prazoDiasUteis} dias úteis.`,
      achado.auditoriaId,
    );

    return atualizado;
  }

  /** Consolidação manual (P02) após manifestação. EM_MANIFESTACAO → CONSOLIDADO. */
  async consolidar(id: string) {
    const achado = await this.findOne(id);
    if (achado.status !== 'EM_MANIFESTACAO') {
      throw new BadRequestException('Apenas achados EM_MANIFESTACAO podem ser consolidados');
    }
    return this.consolidarAchado(id);
  }

  /**
   * Cron: consolida automaticamente achados cujo prazo de manifestação
   * expirou sem resposta da unidade (RF-006.5). Registra ressalva
   * "sem manifestação". Um único `updateMany` em vez de N updates.
   */
  async consolidarExpirados() {
    const result = await this.prisma.achadoAuditoria.updateMany({
      where: {
        status: 'EM_MANIFESTACAO',
        prazoManifestacao: { lt: new Date() },
      },
      data: {
        status: 'CONSOLIDADO',
        dataConsolidacao: new Date(),
        ressalva: RESSALVA_SEM_MANIFESTACAO,
      },
    });

    if (result.count > 0) {
      this.logger.log(`Consolidados ${result.count} achados por expiração de prazo (sem manifestação).`);
    }
    return { consolidados: result.count };
  }

  // ── Manifestações ─────────────────────────────

  /**
   * Registra a manifestação da unidade auditada.
   * - Escopo: o P05 só pode manifestar sobre achados da sua unidade (RF-006.4 / teste #6).
   * - Ao registrar, notifica o autor (P02) e CONSOLIDA o achado (teste #4 do PRP).
   */
  async criarManifestacao(
    achadoId: string,
    dto: CreateManifestacaoDto,
    autorId: string,
    unidadeEscopo?: string | null,
  ) {
    const achado = await this.findOne(achadoId, unidadeEscopo);
    if (achado.status !== 'EM_MANIFESTACAO') {
      throw new BadRequestException('Manifestações só podem ser registradas em achados EM_MANIFESTACAO');
    }

    // Cria a manifestação e consolida o achado atomicamente (encerra a fase de manifestação).
    // A notificação ao autor (P02) fica fora da transação: é best-effort e não deve reverter
    // o registro da manifestação caso falhe.
    const manifestacao = await this.prisma.$transaction(async (tx) => {
      const criada = await tx.manifestacao.create({
        data: { achadoId, conteudo: dto.conteudo, tipo: dto.tipo, autorId },
        include: { achado: { select: { id: true, codigo: true, status: true } } },
      });
      await this.consolidarAchado(achadoId, tx);
      // O include acima snapshota o status antes da consolidação — corrige para refletir o estado real.
      return { ...criada, achado: { ...criada.achado, status: 'CONSOLIDADO' } };
    });

    await this.notificacoes.criar(
      achado.autorId,
      'MANIFESTACAO_REGISTRADA',
      `Manifestação (${dto.tipo}) registrada para o achado ${achado.codigo}.`,
      achado.auditoriaId,
    );

    return manifestacao;
  }

  async listarManifestacoes(achadoId: string) {
    return this.prisma.manifestacao.findMany({
      where: { achadoId },
      orderBy: { dataManifestacao: 'asc' },
    });
  }

  // ── Helpers ───────────────────────────────────

  /**
   * Transição atômica para CONSOLIDADO. Centraliza o formato do update para que
   * consolidar() (manual) e criarManifestacao() compartilhem a mesma forma de
   * dados. Aceita um client de transação opcional (quando chamada dentro de
   * $transaction). A ressalva "sem manifestação" é registrada apenas pelo cron
   * (consolidarExpirados), não por esta via.
   */
  private async consolidarAchado(id: string, tx: Prisma.TransactionClient = this.prisma) {
    return tx.achadoAuditoria.update({
      where: { id },
      data: { status: 'CONSOLIDADO', dataConsolidacao: new Date() },
      include: this.achadoInclude,
    });
  }

  private readonly achadoInclude = {
    auditoria: { select: { id: true, numero: true, unidadeAuditada: true } },
    manifestacoes: { orderBy: { dataManifestacao: 'asc' } },
  } as const;
}
