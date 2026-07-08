import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { INaoConformidadeRepository, NAO_CONFORMIDADE_REPOSITORY } from './nao-conformidade.repository';
@Injectable()
export class PrismaNaoConformidadeRepository implements INaoConformidadeRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.naoConformidade.create({ data });
  }
  async findMany(where: any) {
    return this.prisma.naoConformidade.findMany(where);
  }
  async findUnique(id: string) {
    return this.prisma.naoConformidade.findUnique({ where: { id } });
  }
  async update(id: string, data: any) {
    return this.prisma.naoConformidade.update({ where: { id }, data });
  }
}
