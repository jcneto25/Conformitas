import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IConsultoriaRepository, CONSULTORIA_REPOSITORY } from './consultoria.repository';
@Injectable()
export class PrismaConsultoriaRepository implements IConsultoriaRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return this.prisma.consultoria.create({ data }); }
  async findAll(tipo?: string) { const where: any = {}; if (tipo) where.tipo = tipo; return this.prisma.consultoria.findMany({ where, orderBy: { createdAt: 'desc' } }); }
  async findUnique(id: string) { return this.prisma.consultoria.findUnique({ where: { id } }); }
  async findBySolicitacao(solicitacaoId: string) { return this.prisma.consultoria.findMany({ where: { solicitacaoId } }); }
  async update(id: string, data: any) { return this.prisma.consultoria.update({ where: { id }, data }); }
}
