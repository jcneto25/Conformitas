import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPapelTrabalhoRepository, PAPEL_TRABALHO_REPOSITORY } from './repositories/auditoria.repository';
import { CriarPapelTrabalhoDto } from './dto/criar-papel-trabalho.dto';

@Injectable()
export class PapeisTrabalhoService {
  constructor(@Inject(PAPEL_TRABALHO_REPOSITORY) private readonly repo: IPapelTrabalhoRepository) {}

  async criar(auditoriaId: string, dto: CriarPapelTrabalhoDto, autorId: string) {
    return this.repo.create({ auditoriaId, codigo: dto.codigo, descricao: dto.descricao, evidenciaIds: dto.evidenciaIds || [], autorId });
  }

  async listar(auditoriaId: string) {
    return this.repo.findMany({ where: { auditoriaId }, orderBy: { createdAt: 'desc' } });
  }
}
