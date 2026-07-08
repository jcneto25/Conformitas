import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IRiscoRepository, RiscoFilter, RiscoReadModel } from './risco.repository';

function mapRisco(raw: any): RiscoReadModel {
  return { id: raw.id, nome: raw.nome, categoria: raw.categoria, probabilidade: raw.probabilidade,
    impacto: raw.impacto, nivel: raw.nivel, status: raw.status, createdAt: raw.createdAt, updatedAt: raw.updatedAt };
}

@Injectable()
export class PrismaRiscoRepository implements IRiscoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return mapRisco(await this.prisma.risco.create({ data })); }
  async findMany(filter: RiscoFilter) {
    const where: any = {};
    if (filter.categoria) where.categoria = filter.categoria;
    if (filter.status) where.status = filter.status;
    if (filter.nivel) where.nivel = filter.nivel;
    return (await this.prisma.risco.findMany({ where, orderBy: { createdAt: 'desc' } })).map(mapRisco);
  }
  async findUnique(id: string) { const r = await this.prisma.risco.findUnique({ where: { id } }); return r ? mapRisco(r) : null; }
  async update(id: string, data: any) { return mapRisco(await this.prisma.risco.update({ where: { id }, data })); }
  async delete(id: string) { return mapRisco(await this.prisma.risco.delete({ where: { id } })); }
}
