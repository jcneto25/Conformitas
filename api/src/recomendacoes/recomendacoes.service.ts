import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const CRITICIDADES_VALIDAS = ['ALTA', 'MEDIA', 'BAIXA'];
const DIAS_ESCALONAMENTO = 30;

interface CriarRecomendacaoDto {
  descricao: string;
  criticidade: string;
  prazo: Date;
  responsavelId: string;
  achadoId?: string | null;
}

interface CriarProvidenciaDto {
  descricao: string;
  autorId: string;
  evidenciaPath?: string | null;
}

interface FindRecomendacoesParams {
  status?: string;
  criticidade?: string;
  auditoriaId?: string;
}

@Injectable()
export class RecomendacoesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── RF-008.1: Emitir recomendação ──────────────

  async criar(relatorioId: string, dto: CriarRecomendacaoDto) {
    const relatorio = await this.prisma.relatorioAuditoria.findUnique({
      where: { id: relatorioId },
    });
    if (!relatorio) throw new NotFoundException('Relatório não encontrado');
    if (!CRITICIDADES_VALIDAS.includes(dto.criticidade)) {
      throw new BadRequestException('Criticidade inválida (ALTA | MEDIA | BAIXA)');
    }

    return this.prisma.recomendacao.create({
      data: {
        relatorioId,
        achadoId: dto.achadoId ?? null,
        descricao: dto.descricao,
        criticidade: dto.criticidade,
        prazo: dto.prazo,
        responsavelId: dto.responsavelId,
        status: 'PENDENTE',
      },
      include: { providencias: true },
    });
  }

  // ── Consultas ──────────────────────────────────

  async findAll(params?: FindRecomendacoesParams) {
    const where: any = {};
    if (params?.status) where.status = params.status;
    if (params?.criticidade) where.criticidade = params.criticidade;
    if (params?.auditoriaId) where.relatorio = { auditoriaId: params.auditoriaId };

    return this.prisma.recomendacao.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        providencias: { orderBy: { data: 'asc' } },
        relatorio: { select: { id: true, tipo: true, auditoria: { select: { id: true, numero: true } } } },
      },
    });
  }

  async findOne(id: string) {
    const rec = await this.prisma.recomendacao.findUnique({
      where: { id },
      include: {
        providencias: { orderBy: { data: 'asc' } },
        relatorio: { select: { id: true, tipo: true } },
      },
    });
    if (!rec) throw new NotFoundException('Recomendação não encontrada');
    return rec;
  }

  async atualizar(id: string, dto: Partial<CriarRecomendacaoDto> & { status?: string }) {
    await this.findOne(id);
    const data: any = {};
    if (dto.descricao) data.descricao = dto.descricao;
    if (dto.criticidade) data.criticidade = dto.criticidade;
    if (dto.prazo) data.prazo = dto.prazo;
    if (dto.status) data.status = dto.status;
    return this.prisma.recomendacao.update({ where: { id }, data });
  }

  // ── RF-008.2: Providência → EM_ANDAMENTO ───────

  async criarProvidencia(recomendacaoId: string, dto: CriarProvidenciaDto) {
    const rec = await this.findOne(recomendacaoId);
    if (rec.status === 'CUMPRIDA' || rec.status === 'CANCELADA') {
      throw new BadRequestException('Recomendação encerrada não aceita providências');
    }

    const providencia = await this.prisma.providencia.create({
      data: {
        recomendacaoId,
        descricao: dto.descricao,
        autorId: dto.autorId,
        evidenciaPath: dto.evidenciaPath ?? null,
      },
    });

    // PENDENTE → EM_ANDAMENTO ao registrar a primeira providência
    if (rec.status === 'PENDENTE') {
      await this.prisma.recomendacao.update({
        where: { id: recomendacaoId },
        data: { status: 'EM_ANDAMENTO' },
      });
    }

    return providencia;
  }

  // ── RF-008.3: Validar → CUMPRIDA ───────────────

  async validar(id: string) {
    const rec = await this.findOne(id);
    if (rec.status !== 'EM_ANDAMENTO') {
      throw new BadRequestException('Apenas recomendações EM_ANDAMENTO podem ser validadas');
    }
    return this.prisma.recomendacao.update({ where: { id }, data: { status: 'CUMPRIDA' } });
  }

  // ── RF-008.4: Vencimento (cron) ────────────────

  async verificarVencidas() {
    const vencendo = await this.prisma.recomendacao.findMany({
      where: {
        status: { in: ['PENDENTE', 'EM_ANDAMENTO'] },
        prazo: { lt: new Date() },
      },
    });

    for (const rec of vencendo) {
      await this.prisma.recomendacao.update({
        where: { id: rec.id },
        data: { status: 'VENCIDA' },
      });
    }

    // Notificação P01 + P06 (sem infra de notificação real — registrado no retorno)
    return {
      vencidas: vencendo.length,
      notificados: vencendo.length > 0 ? ['P01', 'P06'] : [],
    };
  }

  // ── RF-008.5: Escalonamento 30 dias (cron) ─────

  async escalarVencidas() {
    const limite = new Date();
    limite.setDate(limite.getDate() - DIAS_ESCALONAMENTO);

    const escalonar = await this.prisma.recomendacao.findMany({
      where: { status: 'VENCIDA', prazo: { lt: limite } },
    });

    // Escalonamento: notificar P01 (possível comunicação ao Presidente) — sem infra real
    return {
      escaladas: escalonar.length,
      notificar: escalonar.length > 0 ? ['P01'] : [],
      recomendacoes: escalonar,
    };
  }
}
