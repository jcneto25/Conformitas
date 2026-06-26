import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogsSistemaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    usuarioId?: string;
    acao?: string;
    dataInicio?: string;
    dataFim?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};

    if (params.usuarioId) where.usuarioId = params.usuarioId;
    if (params.acao) where.acao = params.acao;
    if (params.dataInicio || params.dataFim) {
      where.createdAt = {};
      if (params.dataInicio) where.createdAt.gte = new Date(params.dataInicio);
      if (params.dataFim) where.createdAt.lte = new Date(params.dataFim);
    }

    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.logSistema.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          usuario: { select: { id: true, nome: true, email: true } },
        },
      }),
      this.prisma.logSistema.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async registrar(params: {
    usuarioId?: string;
    acao: string;
    entidadeTipo?: string;
    entidadeId?: string;
    detalhes?: any;
    ip?: string;
    userAgent?: string;
  }) {
    return this.prisma.logSistema.create({ data: params });
  }
}
