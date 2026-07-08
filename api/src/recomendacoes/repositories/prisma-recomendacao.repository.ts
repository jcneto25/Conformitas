import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IRecomendacaoRepository, RECOMENDACAO_REPOSITORY, IProvidenciaRepository, PROVIDENCIA_REPOSITORY } from './recomendacao.repository';
@Injectable()
export class PrismaRecomendacaoRepository implements IRecomendacaoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return this.prisma.recomendacao.create({ data }); }
  async findMany(where: any) { return this.prisma.recomendacao.findMany(where); }
  async findUnique(id: string, include?: any) { return this.prisma.recomendacao.findUnique({ where: { id }, include }); }
  async update(id: string, data: any) { return this.prisma.recomendacao.update({ where: { id }, data }); }
}
@Injectable()
export class PrismaProvidenciaRepository implements IProvidenciaRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return this.prisma.providencia.create({ data }); }
  async findMany(where: any) { return this.prisma.providencia.findMany(where); }
}
