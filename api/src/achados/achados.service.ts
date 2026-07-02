import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateAchadoDto {
  auditoriaId: string;
  tipo: string;
  situacaoEncontrada: string;
  criterio: string;
  causa: string;
  efeito: string;
  evidenciaIds?: string[];
  autorId: string;
}

interface CreateManifestacaoDto {
  conteudo: string;
  tipo: string;
  autorId: string;
}

@Injectable()
export class AchadosService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Achados ───────────────────────────────────

  async create(dto: CreateAchadoDto) {
    const auditoria = await this.prisma.auditoria.findUnique({
      where: { id: dto.auditoriaId },
    });
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');
    if (auditoria.status !== 'EM_EXECUCAO') {
      throw new BadRequestException('Achados só podem ser criados em auditorias EM_EXECUCAO');
    }

    // Gerar código sequencial por auditoria
    const count = await this.prisma.achadoAuditoria.count({
      where: { auditoriaId: dto.auditoriaId },
    });

    return this.prisma.achadoAuditoria.create({
      data: {
        auditoriaId: dto.auditoriaId,
        codigo: `ACH-${count + 1}`,
        tipo: dto.tipo,
        situacaoEncontrada: dto.situacaoEncontrada,
        criterio: dto.criterio,
        causa: dto.causa,
        efeito: dto.efeito,
        status: 'PRELIMINAR',
        evidenciaIds: dto.evidenciaIds || [],
        autorId: dto.autorId,
      },
      include: {
        auditoria: { select: { id: true, numero: true, unidadeAuditada: true } },
        manifestacoes: true,
      },
    });
  }

  async findAll(params?: { status?: string; auditoriaId?: string; search?: string }, unidadeEscopo?: string | null) {
    const where: any = {};
    if (params?.status) where.status = params.status;
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

  async findOne(id: string) {
    const achado = await this.prisma.achadoAuditoria.findUnique({
      where: { id },
      include: {
        auditoria: { select: { id: true, numero: true, unidadeAuditada: true } },
        manifestacoes: { orderBy: { dataManifestacao: 'asc' } },
        recomendacoes: true,
      },
    });
    if (!achado) throw new NotFoundException('Achado não encontrado');
    return achado;
  }

  async update(id: string, dto: Partial<CreateAchadoDto>) {
    await this.findOne(id);
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
    });
  }

  // ── Workflow ──────────────────────────────────

  async enviarManifestacao(id: string, prazoDias: number = 5) {
    const achado = await this.findOne(id);
    if (achado.status !== 'PRELIMINAR') {
      throw new BadRequestException('Apenas achados PRELIMINAR podem ser enviados para manifestação');
    }

    const prazo = new Date();
    prazo.setDate(prazo.getDate() + prazoDias);

    return this.prisma.achadoAuditoria.update({
      where: { id },
      data: {
        status: 'EM_MANIFESTACAO',
        prazoManifestacao: prazo,
      },
    });
  }

  async consolidar(id: string) {
    const achado = await this.findOne(id);
    if (achado.status !== 'EM_MANIFESTACAO') {
      throw new BadRequestException('Apenas achados EM_MANIFESTACAO podem ser consolidados');
    }

    return this.prisma.achadoAuditoria.update({
      where: { id },
      data: {
        status: 'CONSOLIDADO',
        dataConsolidacao: new Date(),
      },
    });
  }

  async consolidarExpirados() {
    // Cron job: consolida automaticamente achados com prazo expirado
    const expirados = await this.prisma.achadoAuditoria.findMany({
      where: {
        status: 'EM_MANIFESTACAO',
        prazoManifestacao: { lt: new Date() },
      },
    });

    for (const achado of expirados) {
      await this.prisma.achadoAuditoria.update({
        where: { id: achado.id },
        data: {
          status: 'CONSOLIDADO',
          dataConsolidacao: new Date(),
        },
      });
    }

    return { consolidados: expirados.length };
  }

  // ── Manifestações ─────────────────────────────

  async criarManifestacao(achadoId: string, dto: CreateManifestacaoDto) {
    const achado = await this.findOne(achadoId);
    if (achado.status !== 'EM_MANIFESTACAO') {
      throw new BadRequestException('Manifestações só podem ser registradas em achados EM_MANIFESTACAO');
    }

    return this.prisma.manifestacao.create({
      data: {
        achadoId,
        conteudo: dto.conteudo,
        tipo: dto.tipo,
        autorId: dto.autorId,
      },
      include: {
        achado: { select: { id: true, codigo: true, status: true } },
      },
    });
  }

  async listarManifestacoes(achadoId: string) {
    return this.prisma.manifestacao.findMany({
      where: { achadoId },
      orderBy: { dataManifestacao: 'asc' },
    });
  }
}
