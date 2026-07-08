import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ICapacitacaoRepository, CapacitacaoFilter, CapacitacaoReadModel } from './capacitacao.repository';

function mapCapacitacao(raw: any): CapacitacaoReadModel {
  return {
    id: raw.id, titulo: raw.titulo, instituicao: raw.instituicao,
    cargaHoraria: raw.cargaHoraria, tipo: raw.tipo,
    dataInicio: raw.dataInicio, dataFim: raw.dataFim,
    participanteIds: raw.participanteIds ?? [],
    certificadoPath: raw.certificadoPath,
    createdAt: raw.createdAt, updatedAt: raw.updatedAt,
  };
}

@Injectable()
export class PrismaCapacitacaoRepository implements ICapacitacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return mapCapacitacao(await this.prisma.capacitacao.create({ data }));
  }

  async findMany(filter: CapacitacaoFilter) {
    const where: any = {};
    if (filter.tipo) where.tipo = filter.tipo;
    if (filter.participanteId) where.participanteIds = { array_contains: filter.participanteId };
    if (filter.ano) {
      where.dataInicio = { gte: new Date(`${filter.ano}-01-01`), lte: new Date(`${filter.ano}-12-31`) };
    }
    return (await this.prisma.capacitacao.findMany({ where, orderBy: { dataInicio: 'desc' } })).map(mapCapacitacao);
  }

  async findUnique(id: string) {
    const r = await this.prisma.capacitacao.findUnique({ where: { id } });
    return r ? mapCapacitacao(r) : null;
  }

  async update(id: string, data: any) {
    return mapCapacitacao(await this.prisma.capacitacao.update({ where: { id }, data }));
  }

  async delete(id: string) {
    return mapCapacitacao(await this.prisma.capacitacao.delete({ where: { id } }));
  }

  async findConfig(chave: string) {
    return this.prisma.configuracaoSistema.findUnique({ where: { chave } });
  }
}
