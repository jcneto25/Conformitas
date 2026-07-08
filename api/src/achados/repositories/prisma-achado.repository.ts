import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AchadoStatus } from '../domain/achado-status';
import {
  IAchadoRepository,
  IManifestacaoRepository,
  AchadoCreateInput,
  AchadoListaItem,
} from './achado.repository';

function mapAchado(raw: any): AchadoListaItem {
  return {
    id: raw.id,
    auditoriaId: raw.auditoriaId,
    codigo: raw.codigo,
    status: raw.status as AchadoStatus,
    tipo: raw.tipo,
    situacaoEncontrada: raw.situacaoEncontrada,
    criterio: raw.criterio,
    causa: raw.causa,
    efeito: raw.efeito,
    evidenciaIds: raw.evidenciaIds ?? [],
    autorId: raw.autorId,
    dataLimiteManifestacao: raw.dataLimiteManifestacao,
    ressalva: raw.ressalva,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    auditoria: raw.auditoria,
    manifestacoes: raw.manifestacoes,
    _count: raw._count,
  };
}

@Injectable()
export class PrismaAchadoRepository implements IAchadoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: AchadoCreateInput): Promise<AchadoListaItem> {
    const raw = await this.prisma.achadoAuditoria.create({
      data,
      include: {
        auditoria: { select: { id: true, numero: true, unidadeAuditada: true, status: true } },
      },
    });
    return mapAchado(raw);
  }

  async findMany(where: any): Promise<AchadoListaItem[]> {
    const raws = await this.prisma.achadoAuditoria.findMany(where);
    return raws.map(mapAchado);
  }

  async findUnique(id: string, include?: any): Promise<any | null> {
    return this.prisma.achadoAuditoria.findUnique({ where: { id }, include });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.achadoAuditoria.update({ where: { id }, data });
  }

  async count(where: any): Promise<number> {
    return this.prisma.achadoAuditoria.count(where);
  }
}

@Injectable()
export class PrismaManifestacaoRepository implements IManifestacaoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return this.prisma.manifestacao.create({ data }); }
  async findMany(where: any) { return this.prisma.manifestacao.findMany(where); }
}
