import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { CreateItemPlanoDto } from './dto/create-item-plano.dto';
import { CreateForcaTrabalhoDto } from './dto/create-forca-trabalho.dto';

@Injectable()
export class PlanosService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Planos ────────────────────────────────────

  async create(dto: CreatePlanoDto, criadoPorId: string) {
    return this.prisma.planoAuditoria.create({
      data: {
        tipo: dto.tipo,
        anoInicio: dto.anoInicio,
        anoFim: dto.anoFim,
        status: 'RASCUNHO',
        versao: 1,
        criadoPorId,
      },
    });
  }

  async findAll(params?: { tipo?: string; ano?: number; status?: string }) {
    const where: any = { deletedAt: null };
    if (params?.tipo) where.tipo = params.tipo;
    if (params?.ano) {
      where.anoInicio = { lte: params.ano };
      where.anoFim = { gte: params.ano };
    }
    if (params?.status) where.status = params.status;
    return this.prisma.planoAuditoria.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        itensPlano: {
          include: { universo: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const plano = await this.prisma.planoAuditoria.findUnique({
      where: { id },
      include: {
        itensPlano: {
          include: { universo: true },
        },
        forcTrabalho: {
          include: { usuario: { select: { id: true, nome: true, email: true } } },
        },
      },
    });
    if (!plano || plano.deletedAt) throw new NotFoundException('Plano não encontrado');
    return plano;
  }

  async submeter(id: string) {
    const plano = await this.prisma.planoAuditoria.findUnique({
      where: { id },
      include: {
        itensPlano: true,
        forcTrabalho: true,
      },
    });
    if (!plano) throw new NotFoundException('Plano não encontrado');
    if (plano.status !== 'RASCUNHO') {
      throw new BadRequestException('Apenas planos em RASCUNHO podem ser submetidos');
    }
    if (plano.itensPlano.length === 0) {
      throw new BadRequestException('Plano deve ter ao menos 1 item');
    }

    // Validar horas disponíveis vs alocadas (apenas para PAA)
    if (plano.tipo === 'PAA' && plano.forcTrabalho.length > 0) {
      const horasDisponiveis = plano.forcTrabalho.reduce((s, f) => s + f.horasDisponiveisAno, 0);
      const horasAlocadas = plano.itensPlano.reduce((s, i) => s + (i.horasEstimadas || 0), 0);
      if (horasAlocadas > horasDisponiveis) {
        throw new BadRequestException(
          `Horas alocadas (${horasAlocadas}h) excedem a força de trabalho (${horasDisponiveis}h)`,
        );
      }
    }

    return this.prisma.planoAuditoria.update({
      where: { id },
      data: { status: 'SUBMETIDO', dataSubmissao: new Date() },
    });
  }

  async aprovar(id: string) {
    const plano = await this.prisma.planoAuditoria.findUnique({ where: { id } });
    if (!plano) throw new NotFoundException('Plano não encontrado');
    if (plano.status !== 'SUBMETIDO') {
      throw new BadRequestException('Apenas planos SUBMETIDOS podem ser aprovados');
    }

    return this.prisma.planoAuditoria.update({
      where: { id },
      data: { status: 'APROVADO', dataAprovacao: new Date() },
    });
  }

  async publicar(id: string) {
    const plano = await this.prisma.planoAuditoria.findUnique({ where: { id } });
    if (!plano) throw new NotFoundException('Plano não encontrado');
    if (plano.status !== 'APROVADO') {
      throw new BadRequestException('Apenas planos APROVADOS podem ser publicados');
    }
    return this.prisma.planoAuditoria.update({
      where: { id },
      data: { status: 'PUBLICADO', dataPublicacao: new Date() },
    });
  }

  async criarRevisao(id: string, criadoPorId: string) {
    const plano = await this.findOne(id);
    return this.prisma.planoAuditoria.create({
      data: {
        tipo: plano.tipo,
        anoInicio: plano.anoInicio,
        anoFim: plano.anoFim,
        status: 'RASCUNHO',
        versao: plano.versao + 1,
        criadoPorId,
      },
    });
  }

  // ── Itens do Plano ────────────────────────────

  async adicionarItem(planoId: string, dto: CreateItemPlanoDto) {
    const plano = await this.prisma.planoAuditoria.findUnique({ where: { id: planoId } });
    if (!plano) throw new NotFoundException('Plano não encontrado');
    if (plano.status !== 'RASCUNHO') {
      throw new BadRequestException('Itens só podem ser adicionados em planos RASCUNHO');
    }

    return this.prisma.itemPlano.create({
      data: {
        planoId,
        universoAuditavelId: dto.universoAuditavelId,
        tipoAuditoria: dto.tipoAuditoria,
        formaExecucao: dto.formaExecucao,
        horasEstimadas: dto.horasEstimadas,
        escopo: dto.escopo,
        objetivo: dto.objetivo,
        prioridade: dto.prioridade,
      },
      include: { universo: true },
    });
  }

  async listarItens(planoId: string) {
    return this.prisma.itemPlano.findMany({
      where: { planoId },
      include: { universo: true },
    });
  }

  async removerItem(id: string) {
    const item = await this.prisma.itemPlano.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item não encontrado');
    return this.prisma.itemPlano.delete({ where: { id } });
  }

  // ── Força de Trabalho ─────────────────────────

  async adicionarForcaTrabalho(planoId: string, dto: Omit<CreateForcaTrabalhoDto, 'planoId'>) {
    return this.prisma.forcaTrabalho.create({
      data: {
        planoId,
        usuarioId: dto.usuarioId,
        horasDisponiveisAno: dto.horasDisponiveisAno,
        ano: dto.ano,
      },
      include: { usuario: { select: { id: true, nome: true, email: true } } },
    });
  }

  async listarForcaTrabalho(planoId?: string, ano?: number) {
    const where: any = {};
    if (planoId) where.planoId = planoId;
    if (ano) where.ano = ano;
    return this.prisma.forcaTrabalho.findMany({
      where,
      include: { usuario: { select: { id: true, nome: true, email: true } } },
    });
  }
}
