import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ILogSistemaRepository, LOG_SISTEMA_REPOSITORY } from './log-sistema.repository';
@Injectable()
export class PrismaLogSistemaRepository implements ILogSistemaRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(params: any) {
    const where: any = {};
    if (params.usuarioId) where.usuarioId = params.usuarioId;
    if (params.acao) where.acao = params.acao;
    if (params.dataInicio || params.dataFim) { where.createdAt = {}; if (params.dataInicio) where.createdAt.gte = new Date(params.dataInicio); if (params.dataFim) where.createdAt.lte = new Date(params.dataFim); }
    const page = params.page || 1; const limit = params.limit || 50; const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([this.prisma.logSistema.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit, include: { usuario: { select: { id: true, nome: true, email: true } } } }), this.prisma.logSistema.count({ where })]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
  async create(data: any) { return this.prisma.logSistema.create({ data }); }
}
