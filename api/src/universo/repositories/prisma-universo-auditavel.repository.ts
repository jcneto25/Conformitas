import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUniversoAuditavelRepository, UniversoFilter, UniversoReadModel } from './universo-auditavel.repository';

function mapUniverso(raw: any): UniversoReadModel {
  return { id: raw.id, nome: raw.nome, tipo: raw.tipo, unidadeResponsavel: raw.unidadeResponsavel,
    materialidade: raw.materialidade, relevancia: raw.relevancia, criticidade: raw.criticidade,
    risco: raw.risco, indicePriorizacao: raw.indicePriorizacao, ativo: raw.ativo,
    deletedAt: raw.deletedAt, createdAt: raw.createdAt, updatedAt: raw.updatedAt };
}

@Injectable()
export class PrismaUniversoAuditavelRepository implements IUniversoAuditavelRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return mapUniverso(await this.prisma.universoAuditavel.create({ data })); }
  async findMany(filter: UniversoFilter) {
    const where: any = { deletedAt: null };
    if (filter.tipo) where.tipo = filter.tipo;
    if (filter.ativo !== undefined) where.ativo = filter.ativo;
    if (filter.search) { where.OR = [{ nome: { contains: filter.search, mode: 'insensitive' } }, { unidadeResponsavel: { contains: filter.search, mode: 'insensitive' } }]; }
    return (await this.prisma.universoAuditavel.findMany({ where, orderBy: { indicePriorizacao: 'desc' } })).map(mapUniverso);
  }
  async findUnique(id: string) { return this.prisma.universoAuditavel.findUnique({ where: { id } }); }
  async update(id: string, data: any) { return this.prisma.universoAuditavel.update({ where: { id }, data }); }
}
