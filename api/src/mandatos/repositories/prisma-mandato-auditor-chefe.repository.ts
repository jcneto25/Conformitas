import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IMandatoAuditorChefeRepository, MANDATO_AUDITOR_CHEFE_REPOSITORY } from './mandato-auditor-chefe.repository';
@Injectable()
export class PrismaMandatoAuditorChefeRepository implements IMandatoAuditorChefeRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.mandatoAuditorChefe.create({
      data,
      include: { usuario: { select: { id: true, nome: true, email: true } } },
    });
  }
  async findAll() {
    return this.prisma.mandatoAuditorChefe.findMany({
      include: { usuario: { select: { id: true, nome: true, email: true } } },
      orderBy: { dataInicio: 'desc' },
    });
  }
  async findUnique(id: string) {
    return this.prisma.mandatoAuditorChefe.findUnique({
      where: { id },
      include: { usuario: { select: { id: true, nome: true, email: true } } },
    });
  }
  async findByUsuario(usuarioId: string) {
    return this.prisma.mandatoAuditorChefe.findMany({ where: { usuarioId }, orderBy: { numeroMandato: 'desc' } });
  }
  async update(id: string, data: any) {
    return this.prisma.mandatoAuditorChefe.update({ where: { id }, data });
  }
}
