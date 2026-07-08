import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IDeclaracaoRepository,
  DECLARACAO_REPOSITORY,
  IImpedimentoRepository,
  IMPEDIMENTO_REPOSITORY,
  IClassificacaoRepository,
  CLASSIFICACAO_REPOSITORY,
  ILogSigilosoRepository,
  LOG_SIGILOSO_REPOSITORY,
} from './declaracao.repository';
@Injectable()
export class PrismaDeclaracaoRepository implements IDeclaracaoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.declaracaoIndependencia.create({ data });
  }
  async findMany(where: any) {
    return this.prisma.declaracaoIndependencia.findMany(where);
  }
}
@Injectable()
export class PrismaImpedimentoRepository implements IImpedimentoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.impedimento.create({ data });
  }
  async findMany(where: any) {
    return this.prisma.impedimento.findMany(where);
  }
  async findUnique(id: string) {
    return this.prisma.impedimento.findUnique({ where: { id } });
  }
  async update(id: string, data: any) {
    return this.prisma.impedimento.update({ where: { id }, data });
  }
}
@Injectable()
export class PrismaClassificacaoRepository implements IClassificacaoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async upsert(where: any, data: any) {
    return this.prisma.classificacaoDocumento.upsert({ where, update: data, create: data });
  }
  async findUnique(where: any) {
    return this.prisma.classificacaoDocumento.findUnique(where);
  }
}
@Injectable()
export class PrismaLogSigilosoRepository implements ILogSigilosoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.logAcessoSigiloso.create({ data });
  }
  async findMany(where: any) {
    return this.prisma.logAcessoSigiloso.findMany(where);
  }
}
