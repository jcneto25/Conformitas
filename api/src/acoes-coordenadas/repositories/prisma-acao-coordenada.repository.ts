import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IAcaoCoordenadaRepository, ACAO_COORDENADA_REPOSITORY } from './acao-coordenada.repository';
@Injectable()
export class PrismaAcaoCoordenadaRepository implements IAcaoCoordenadaRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    return this.prisma.acaoCoordenada.findMany({ orderBy: { createdAt: 'desc' } });
  }
  async findUnique(id: string) {
    return this.prisma.acaoCoordenada.findUnique({ where: { id } });
  }
  async findFirst(where: any) {
    return this.prisma.acaoCoordenada.findFirst(where);
  }
  async create(data: any) {
    return this.prisma.acaoCoordenada.create({ data });
  }
  async update(id: string, data: any) {
    return this.prisma.acaoCoordenada.update({ where: { id }, data });
  }
}
