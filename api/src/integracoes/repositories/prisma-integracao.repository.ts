import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IIntegracaoRepository, INTEGRACAO_REPOSITORY } from './integracao.repository';
@Injectable()
export class PrismaIntegracaoRepository implements IIntegracaoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() { return this.prisma.integracao.findMany({ orderBy: { createdAt: 'desc' } }); }
  async findUnique(id: string) { return this.prisma.integracao.findUnique({ where: { id } }); }
  async findByNome(nome: string) { return this.prisma.integracao.findFirst({ where: { nome } }); }
  async create(data: any) { return this.prisma.integracao.create({ data }); }
  async update(id: string, data: any) { return this.prisma.integracao.update({ where: { id }, data }); }
  async delete(id: string) { return this.prisma.integracao.delete({ where: { id } }); }
}
