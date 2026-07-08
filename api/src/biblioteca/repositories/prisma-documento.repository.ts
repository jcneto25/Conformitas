import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IDocumentoRepository, DocumentoFilter, DOCUMENTO_REPOSITORY } from './documento.repository';
@Injectable()
export class PrismaDocumentoRepository implements IDocumentoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return this.prisma.documentoMetodologico.create({ data }); }
  async findMany(filter: DocumentoFilter) {
    const where: any = {};
    if (filter.tipo) where.tipo = filter.tipo; if (filter.categoria) where.categoria = filter.categoria; if (filter.status) where.status = filter.status;
    if (filter.search) { where.OR = [{ titulo: { contains: filter.search, mode: 'insensitive' } }, { categoria: { contains: filter.search, mode: 'insensitive' } }]; }
    return this.prisma.documentoMetodologico.findMany({ where, orderBy: { createdAt: 'desc' } });
  }
  async findUnique(id: string) { return this.prisma.documentoMetodologico.findUnique({ where: { id } }); }
  async update(id: string, data: any) { return this.prisma.documentoMetodologico.update({ where: { id }, data }); }
  async findByTitulo(titulo: string) { return this.prisma.documentoMetodologico.findMany({ where: { titulo: { equals: titulo, mode: 'insensitive' } }, orderBy: { createdAt: 'desc' }, take: 1 }); }
}
