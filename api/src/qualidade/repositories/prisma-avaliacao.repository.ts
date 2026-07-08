import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IAvaliacaoRepository, AVALIACAO_REPOSITORY } from './avaliacao.repository';
@Injectable()
export class PrismaAvaliacaoRepository implements IAvaliacaoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.avaliacaoQualidade.create({ data });
  }
  async findMany(where: any) {
    return this.prisma.avaliacaoQualidade.findMany(where);
  }
  async findUnique(id: string) {
    return this.prisma.avaliacaoQualidade.findUnique({ where: { id } });
  }
  async update(id: string, data: any) {
    return this.prisma.avaliacaoQualidade.update({ where: { id }, data });
  }
}
