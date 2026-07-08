import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ISolicitacaoConsultoriaRepository, SOLICITACAO_CONSULTORIA_REPOSITORY } from './solicitacao-consultoria.repository';
@Injectable()
export class PrismaSolicitacaoConsultoriaRepository implements ISolicitacaoConsultoriaRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return this.prisma.solicitacaoConsultoria.create({ data }); }
  async findMany(status?: string) { const where: any = {}; if (status) where.status = status; return this.prisma.solicitacaoConsultoria.findMany({ where, orderBy: { createdAt: 'desc' } }); }
  async findUnique(id: string) { return this.prisma.solicitacaoConsultoria.findUnique({ where: { id } }); }
  async update(id: string, data: any) { return this.prisma.solicitacaoConsultoria.update({ where: { id }, data }); }
}
