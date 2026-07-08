import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IRelatorioRepository,
  RELATORIO_REPOSITORY,
  IRelatorioAnualRepository,
  RELATORIO_ANUAL_REPOSITORY,
} from './relatorio.repository';
@Injectable()
export class PrismaRelatorioRepository implements IRelatorioRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.relatorioAuditoria.create({ data });
  }
  async findMany(where: any) {
    return this.prisma.relatorioAuditoria.findMany(where);
  }
  async findUnique(id: string, include?: any) {
    return this.prisma.relatorioAuditoria.findUnique({ where: { id }, include });
  }
  async update(id: string, data: any) {
    return this.prisma.relatorioAuditoria.update({ where: { id }, data });
  }
}
@Injectable()
export class PrismaRelatorioAnualRepository implements IRelatorioAnualRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findUnique(where: any) {
    return this.prisma.relatorioAnual.findUnique(where);
  }
  async create(data: any) {
    return this.prisma.relatorioAnual.create({ data });
  }
}
