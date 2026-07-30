import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Injectable()
export class BibliotecaService {
  constructor(private readonly prisma: PrismaService) {}

  private proximaVersao(titulo: string, versaoInformada?: string): string {
    if (versaoInformada) return versaoInformada;
    return `${Date.now()}`;
  }

  async create(dto: CreateDocumentoDto) {
    const versao = dto.versao || this.proximaVersao(dto.titulo);
    return this.prisma.documentoMetodologico.create({
      data: {
        titulo: dto.titulo,
        tipo: dto.tipo,
        categoria: dto.categoria,
        versao,
        arquivoPath: dto.arquivoPath,
        vigenciaInicio: dto.vigenciaInicio ? new Date(dto.vigenciaInicio) : null,
        vigenciaFim: dto.vigenciaFim ? new Date(dto.vigenciaFim) : null,
        status: dto.status,
      },
    });
  }

  async findAll(params?: { tipo?: string; categoria?: string; search?: string; status?: string }) {
    const where: any = {};
    if (params?.tipo) where.tipo = params.tipo;
    if (params?.categoria) where.categoria = params.categoria;
    if (params?.status) where.status = params.status;
    if (params?.search) {
      where.OR = [
        { titulo: { contains: params.search, mode: 'insensitive' } },
        { categoria: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.documentoMetodologico.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.documentoMetodologico.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Documento não encontrado');
    return item;
  }

  async update(id: string, dto: UpdateDocumentoDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.vigenciaInicio) data.vigenciaInicio = new Date(dto.vigenciaInicio);
    if (dto.vigenciaFim) data.vigenciaFim = new Date(dto.vigenciaFim);
    return this.prisma.documentoMetodologico.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.documentoMetodologico.update({
      where: { id }, data: { status: 'ARQUIVADO' }
    });
  }

  async upload(titulo: string, tipo: string, arquivoPath: string, categoria?: string) {
    const existentes = await this.prisma.documentoMetodologico.findMany({
      where: { titulo: { equals: titulo, mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    const versaoAnterior = existentes[0];
    const novaVersao = versaoAnterior
      ? this.incrementarVersao(versaoAnterior.versao)
      : '1.0';
    return this.prisma.documentoMetodologico.create({
      data: {
        titulo,
        tipo,
        categoria,
        versao: novaVersao,
        arquivoPath,
        status: 'ATIVO',
      },
    });
  }

  private incrementarVersao(versaoAtual: string): string {
    const partes = versaoAtual.split('.');
    const major = parseInt(partes[0] ?? '1', 10) || 1;
    const minor = parseInt(partes[1] ?? '', 10) || 0;
    return `${major}.${minor + 1}`;
  }
}
