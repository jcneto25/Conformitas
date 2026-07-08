import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditoriaStatus } from '../domain/auditoria-status';
import {
  IAuditoriaRepository,
  IComunicadoRepository,
  IEvidenciaRepository,
  IPapelTrabalhoRepository,
  IRequisicaoRepository,
  AuditoriaCreateInput,
  AuditoriaListaItem,
  ComunicadoCreateInput,
  ComunicadoReadModel,
} from './auditoria.repository';

function mapAuditoria(raw: any): AuditoriaListaItem {
  return {
    id: raw.id,
    numero: raw.numero,
    status: raw.status as AuditoriaStatus,
    tipo: raw.tipo,
    forma: raw.forma,
    unidadeAuditada: raw.unidadeAuditada,
    objetivo: raw.objetivo,
    sigilosa: raw.sigilosa,
    escopo: raw.escopo,
    dataFimPrevista: raw.dataFimPrevista,
    dataInicio: raw.dataInicio,
    dataFimReal: raw.dataFimReal,
    motivoSuspensao: raw.motivoSuspensao,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    deletedAt: raw.deletedAt,
    itemPlano: raw.itemPlano,
    _count: raw._count,
  };
}

@Injectable()
export class PrismaAuditoriaRepository implements IAuditoriaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async count(where?: any): Promise<number> {
    return this.prisma.auditoria.count(where);
  }

  async create(data: AuditoriaCreateInput): Promise<AuditoriaListaItem> {
    const raw = await this.prisma.auditoria.create({ data });
    return mapAuditoria(raw);
  }

  async findMany(where: any): Promise<AuditoriaListaItem[]> {
    const raws = await this.prisma.auditoria.findMany(where);
    return raws.map(mapAuditoria);
  }

  async findUnique(id: string, include?: any): Promise<any | null> {
    return this.prisma.auditoria.findUnique({ where: { id }, include });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.auditoria.update({ where: { id }, data });
  }
}

@Injectable()
export class PrismaComunicadoRepository implements IComunicadoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async count(where: any): Promise<number> {
    return this.prisma.comunicadoAuditoria.count(where);
  }

  async create(data: ComunicadoCreateInput): Promise<ComunicadoReadModel> {
    return this.prisma.comunicadoAuditoria.create({ data });
  }
}

@Injectable()
export class PrismaEvidenciaRepository implements IEvidenciaRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return this.prisma.evidencia.create({ data }); }
  async findMany(where: any) { return this.prisma.evidencia.findMany(where); }
}

@Injectable()
export class PrismaPapelTrabalhoRepository implements IPapelTrabalhoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return this.prisma.papelTrabalho.create({ data }); }
  async findMany(where: any) { return this.prisma.papelTrabalho.findMany(where); }
}

@Injectable()
export class PrismaRequisicaoRepository implements IRequisicaoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return this.prisma.requisicao.create({ data }); }
  async findMany(where: any) { return this.prisma.requisicao.findMany(where); }
}
