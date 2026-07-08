import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ICompetenciaRepository, CompetenciaFilter, CompetenciaReadModel, COMPETENCIA_REPOSITORY } from './competencia.repository';

function mapCompetencia(raw: any): CompetenciaReadModel {
  return { id: raw.id, nome: raw.nome, tipo: raw.tipo, descricao: raw.descricao, createdAt: raw.createdAt, updatedAt: raw.updatedAt };
}

@Injectable()
export class PrismaCompetenciaRepository implements ICompetenciaRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return mapCompetencia(await this.prisma.competencia.create({ data })); }
  async findMany(filter: CompetenciaFilter) {
    const where: any = {};
    if (filter.tipo) where.tipo = filter.tipo;
    return (await this.prisma.competencia.findMany({ where, orderBy: { nome: 'asc' } })).map(mapCompetencia);
  }
  async findUnique(id: string) { const r = await this.prisma.competencia.findUnique({ where: { id } }); return r ? mapCompetencia(r) : null; }
  async update(id: string, data: any) { return mapCompetencia(await this.prisma.competencia.update({ where: { id }, data })); }
  async delete(id: string) { return mapCompetencia(await this.prisma.competencia.delete({ where: { id } })); }
}
