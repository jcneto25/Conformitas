import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IDocumentoRepository, DOCUMENTO_REPOSITORY } from './repositories/documento.repository';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Injectable()
export class BibliotecaService {
  constructor(@Inject(DOCUMENTO_REPOSITORY) private readonly repo: IDocumentoRepository) {}

  private proximaVersao(titulo: string, versaoInformada?: string): string {
    return versaoInformada || `${Date.now()}`;
  }

  async create(dto: CreateDocumentoDto) {
    const versao = dto.versao || this.proximaVersao(dto.titulo);
    return this.repo.create({
      titulo: dto.titulo,
      tipo: dto.tipo,
      categoria: dto.categoria,
      versao,
      arquivoPath: dto.arquivoPath,
      vigenciaInicio: dto.vigenciaInicio ? new Date(dto.vigenciaInicio) : null,
      vigenciaFim: dto.vigenciaFim ? new Date(dto.vigenciaFim) : null,
      status: dto.status,
    });
  }

  async findAll(params?: { tipo?: string; categoria?: string; search?: string; status?: string }) {
    return this.repo.findMany({
      tipo: params?.tipo,
      categoria: params?.categoria,
      search: params?.search,
      status: params?.status,
    });
  }

  async findOne(id: string) {
    const item = await this.repo.findUnique(id);
    if (!item) throw new NotFoundException('Documento não encontrado');
    return item;
  }

  async update(id: string, dto: UpdateDocumentoDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.vigenciaInicio) data.vigenciaInicio = new Date(dto.vigenciaInicio);
    if (dto.vigenciaFim) data.vigenciaFim = new Date(dto.vigenciaFim);
    return this.repo.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.update(id, { status: 'ARQUIVADO' });
  }

  async upload(titulo: string, tipo: string, arquivoPath: string, categoria?: string) {
    const existentes = await this.repo.findByTitulo(titulo!);
    const versaoAnterior = existentes?.[0];
    const novaVersao = versaoAnterior ? this.incrementarVersao(versaoAnterior.versao) : '1.0';
    return this.repo.create({
      titulo: titulo!,
      tipo: tipo!,
      categoria,
      versao: novaVersao,
      arquivoPath,
      status: 'ATIVO',
    });
  }

  private incrementarVersao(versaoAtual: string): string {
    const partes = versaoAtual.split('.');
    const major = parseInt(partes[0], 10) || 1;
    const minor = parseInt(partes[1], 10) || 0;
    return `${major}.${minor + 1}`;
  }
}
