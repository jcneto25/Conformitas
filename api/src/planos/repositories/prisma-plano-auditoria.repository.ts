import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IPlanoAuditoriaRepository } from './plano-auditoria.repository';
@Injectable()
export class PrismaPlanoAuditoriaRepository implements IPlanoAuditoriaRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.planoAuditoria.create({ data });
  }
  async findMany(where: any) {
    if (where?.ano) {
      const a = where.ano;
      where.anoInicio = { lte: a };
      where.anoFim = { gte: a };
      delete where.ano;
    }
    return this.prisma.planoAuditoria.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { itensPlano: { include: { universo: true } } },
    });
  }
  async findUnique(id: string, include?: any) {
    return this.prisma.planoAuditoria.findUnique({ where: { id }, include });
  }
  async update(id: string, data: any) {
    return this.prisma.planoAuditoria.update({ where: { id }, data });
  }
}
