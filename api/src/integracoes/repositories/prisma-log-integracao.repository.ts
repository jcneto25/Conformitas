import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ILogIntegracaoRepository, LOG_INTEGRACAO_REPOSITORY } from './log-integracao.repository';
@Injectable()
export class PrismaLogIntegracaoRepository implements ILogIntegracaoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return this.prisma.logIntegracao.create({ data }); }
  async findByIntegracao(integracaoId: string) { return this.prisma.logIntegracao.findMany({ where: { integracaoId }, orderBy: { createdAt: 'desc' }, take: 50 }); }
}
