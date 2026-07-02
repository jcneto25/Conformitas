import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { CriarEvidenciaDto } from './dto/criar-evidencia.dto';
import { CriarPapelTrabalhoDto } from './dto/criar-papel-trabalho.dto';
import { CriarRequisicaoDto } from './dto/criar-requisicao.dto';

@Injectable()
export class AuditoriasService {
  constructor(private readonly prisma: PrismaService) {}

  private async gerarNumeroSequencial(): Promise<string> {
    const count = await this.prisma.auditoria.count();
    const ano = new Date().getFullYear();
    return `AUD-${ano}-${String(count + 1).padStart(4, '0')}`;
  }

  // ── Auditorias ────────────────────────────────

  async create(dto: CreateAuditoriaDto) {
    const itemPlano = await this.prisma.itemPlano.findUnique({
      where: { id: dto.itemPlanoId },
      include: { plano: true, universo: true },
    });
    if (!itemPlano) throw new NotFoundException('Item do plano não encontrado');
    if (itemPlano.plano.status !== 'APROVADO' && itemPlano.plano.status !== 'PUBLICADO') {
      throw new BadRequestException('Item do plano deve pertencer a um plano aprovado');
    }

    const numero = await this.gerarNumeroSequencial();

    return this.prisma.auditoria.create({
      data: {
        itemPlanoId: dto.itemPlanoId,
        numero,
        tipo: 'CONFORMIDADE',
        forma: 'DIRETA',
        status: 'ABERTA',
        unidadeAuditada: itemPlano.universo.unidadeResponsavel,
        objetivo: itemPlano.objetivo,
        sigilosa: dto.sigilosa || false,
        escopo: itemPlano.escopo,
      },
      include: {
        itemPlano: { include: { universo: true } },
      },
    });
  }

  async findAll(params?: { status?: string; unidade?: string; search?: string }, unidadeEscopo?: string | null) {
    const where: any = { deletedAt: null };
    if (params?.status) where.status = params.status;
    if (params?.unidade) {
      where.unidadeAuditada = params.unidade;
    } else if (unidadeEscopo) {
      where.unidadeAuditada = unidadeEscopo;
    }
    if (params?.search) {
      where.OR = [
        { numero: { contains: params.search } },
        { unidadeAuditada: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.auditoria.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        itemPlano: { include: { universo: true } },
        _count: { select: { evidencias: true, papeisTrabalho: true, requisicoes: true } },
      },
    });
  }

  async findOne(id: string) {
    const auditoria = await this.prisma.auditoria.findUnique({
      where: { id },
      include: {
        itemPlano: { include: { universo: true } },
        comunicados: { orderBy: { dataEmissao: 'desc' } },
        evidencias: { orderBy: { dataObtencao: 'desc' } },
        papeisTrabalho: { orderBy: { createdAt: 'desc' } },
        requisicoes: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!auditoria || auditoria.deletedAt) throw new NotFoundException('Auditoria não encontrada');
    return auditoria;
  }

  async iniciarExecucao(id: string) {
    const auditoria = await this.prisma.auditoria.findUnique({ where: { id } });
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');
    if (auditoria.status !== 'ABERTA') {
      throw new BadRequestException('Apenas auditorias ABERTAS podem ser iniciadas');
    }
    return this.prisma.auditoria.update({
      where: { id },
      data: { status: 'EM_EXECUCAO', dataInicio: new Date() },
    });
  }

  async concluir(id: string) {
    const auditoria = await this.prisma.auditoria.findUnique({ where: { id } });
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');
    if (auditoria.status !== 'EM_EXECUCAO') {
      throw new BadRequestException('Apenas auditorias EM_EXECUCAO podem ser concluídas');
    }
    return this.prisma.auditoria.update({
      where: { id },
      data: { status: 'CONCLUIDA', dataFimReal: new Date() },
    });
  }

  async suspender(id: string, motivo: string) {
    const auditoria = await this.prisma.auditoria.findUnique({ where: { id } });
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');
    return this.prisma.auditoria.update({
      where: { id },
      data: { status: 'SUSPENSA' },
    });
  }

  // ── Comunicado ────────────────────────────────

  async gerarComunicado(auditoriaId: string, assinadoPor: string) {
    const auditoria = await this.prisma.auditoria.findUnique({
      where: { id: auditoriaId },
      include: { itemPlano: { include: { universo: true } } },
    });
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');

    const count = await this.prisma.comunicadoAuditoria.count({
      where: { auditoriaId },
    });

    return this.prisma.comunicadoAuditoria.create({
      data: {
        auditoriaId,
        numero: `COM-${auditoria.numero}-${count + 1}`,
        conteudo: `Comunicado de abertura da auditoria ${auditoria.numero}. Unidade auditada: ${auditoria.unidadeAuditada}. Objetivo: ${auditoria.objetivo}`,
        assinadoPor,
      },
    });
  }

  // ── Evidências ────────────────────────────────

  async criarEvidencia(auditoriaId: string, dto: CriarEvidenciaDto) {
    const auditoria = await this.prisma.auditoria.findUnique({ where: { id: auditoriaId } });
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');

    return this.prisma.evidencia.create({
      data: {
        auditoriaId,
        tipo: dto.tipo,
        descricao: dto.descricao,
        fonte: dto.fonte,
        arquivoPath: dto.arquivoPath,
      },
    });
  }

  async listarEvidencias(auditoriaId: string) {
    return this.prisma.evidencia.findMany({
      where: { auditoriaId },
      orderBy: { dataObtencao: 'desc' },
    });
  }

  // ── Papéis de Trabalho ────────────────────────

  async criarPapelTrabalho(auditoriaId: string, dto: CriarPapelTrabalhoDto, autorId: string) {
    const auditoria = await this.prisma.auditoria.findUnique({ where: { id: auditoriaId } });
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');

    return this.prisma.papelTrabalho.create({
      data: {
        auditoriaId,
        codigo: dto.codigo,
        descricao: dto.descricao,
        evidenciaIds: dto.evidenciaIds || [],
        autorId,
      },
    });
  }

  async listarPapeisTrabalho(auditoriaId: string) {
    return this.prisma.papelTrabalho.findMany({
      where: { auditoriaId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Requisições ───────────────────────────────

  async criarRequisicao(auditoriaId: string, dto: CriarRequisicaoDto) {
    const auditoria = await this.prisma.auditoria.findUnique({ where: { id: auditoriaId } });
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');

    const prazo = new Date();
    prazo.setDate(prazo.getDate() + dto.prazoDias);

    return this.prisma.requisicao.create({
      data: {
        auditoriaId,
        descricao: dto.descricao,
        prazo,
      },
    });
  }

  async listarRequisicoes(auditoriaId: string) {
    return this.prisma.requisicao.findMany({
      where: { auditoriaId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
