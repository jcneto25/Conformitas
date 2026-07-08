import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IDeterminacaoRepository, DETERMINACAO_REPOSITORY } from './determinacao.repository';
@Injectable()
export class PrismaDeterminacaoRepository implements IDeterminacaoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.determinacaoExterna.create({ data });
  }
  async findMany(where: any) {
    return this.prisma.determinacaoExterna.findMany(where);
  }
  async findUnique(id: string) {
    return this.prisma.determinacaoExterna.findUnique({ where: { id } });
  }
  async update(id: string, data: any) {
    return this.prisma.determinacaoExterna.update({ where: { id }, data });
  }
}
