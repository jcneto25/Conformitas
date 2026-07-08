import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IIndicadorRepository, INDICADOR_REPOSITORY } from './indicador.repository';
@Injectable()
export class PrismaIndicadorRepository implements IIndicadorRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.indicadorQualidade.create({ data });
  }
  async findMany(where?: any) {
    return this.prisma.indicadorQualidade.findMany(where);
  }
  async update(id: string, data: any) {
    return this.prisma.indicadorQualidade.update({ where: { id }, data });
  }
}
