import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUniversoDto } from './dto/create-universo.dto';
import { UpdateUniversoDto } from './dto/update-universo.dto';

@Injectable()
export class UniversoService {
  constructor(private readonly prisma: PrismaService) {}

  private calcularIndice(item: {
    materialidade: number;
    relevancia: number;
    criticidade: number;
    risco: number;
  }): number {
    return Math.pow(item.materialidade * item.relevancia * item.criticidade * item.risco, 1 / 4);
  }

  async create(dto: CreateUniversoDto) {
    const indicePriorizacao = this.calcularIndice(dto);
    return this.prisma.universoAuditavel.create({
      data: {
        nome: dto.nome,
        descricao: dto.descricao,
        tipo: dto.tipo,
        unidadeResponsavel: dto.unidadeResponsavel,
        materialidade: dto.materialidade,
        relevancia: dto.relevancia,
        criticidade: dto.criticidade,
        risco: dto.risco,
        indicePriorizacao,
      },
    });
  }

  async findAll(params?: { tipo?: string; ativo?: boolean; search?: string }) {
    const where: any = { deletedAt: null };
    if (params?.tipo) where.tipo = params.tipo;
    if (params?.ativo !== undefined) where.ativo = params.ativo;
    if (params?.search) {
      where.OR = [
        { nome: { contains: params.search, mode: 'insensitive' } },
        { unidadeResponsavel: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.universoAuditavel.findMany({ where, orderBy: { indicePriorizacao: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.universoAuditavel.findUnique({ where: { id } });
    if (!item || item.deletedAt) throw new NotFoundException('Item do universo não encontrado');
    return item;
  }

  async update(id: string, dto: UpdateUniversoDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.materialidade || dto.relevancia || dto.criticidade || dto.risco) {
      const atual = await this.prisma.universoAuditavel.findUnique({ where: { id } });
      if (atual) {
        data.indicePriorizacao = this.calcularIndice({
          materialidade: dto.materialidade ?? atual.materialidade,
          relevancia: dto.relevancia ?? atual.relevancia,
          criticidade: dto.criticidade ?? atual.criticidade,
          risco: dto.risco ?? atual.risco,
        });
      }
    }
    return this.prisma.universoAuditavel.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.universoAuditavel.update({ where: { id }, data: { deletedAt: new Date(), ativo: false } });
  }

  async matrizPriorizacao(horasDisponiveis?: number) {
    const itens = await this.prisma.universoAuditavel.findMany({
      where: { deletedAt: null, ativo: true },
      orderBy: { indicePriorizacao: 'desc' },
    });

    if (!horasDisponiveis) return { itens, destaques: [] };

    let horasRestantes = horasDisponiveis;
    const destaques: string[] = [];
    for (const item of itens) {
      if (horasRestantes <= 0) break;
      destaques.push(item.id);
      horasRestantes -= 100; // 100h estimadas por item como default
    }
    return { itens, destaques };
  }
}
