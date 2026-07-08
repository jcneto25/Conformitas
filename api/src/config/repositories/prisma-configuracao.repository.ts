import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IConfiguracaoRepository, CONFIGURACAO_REPOSITORY } from './configuracao.repository';

@Injectable()
export class PrismaConfiguracaoRepository implements IConfiguracaoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    return this.prisma.configuracaoSistema.findMany({ orderBy: { chave: 'asc' } });
  }
  async findUnique(chave: string) {
    return this.prisma.configuracaoSistema.findUnique({ where: { chave } });
  }
  async update(chave: string, valor: string) {
    return this.prisma.configuracaoSistema.update({ where: { chave }, data: { valor } });
  }
}
