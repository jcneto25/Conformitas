import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IEvidenciaRepository, EVIDENCIA_REPOSITORY } from './repositories/auditoria.repository';
import { CriarEvidenciaDto } from './dto/criar-evidencia.dto';

@Injectable()
export class EvidenciasService {
  constructor(@Inject(EVIDENCIA_REPOSITORY) private readonly repo: IEvidenciaRepository) {}

  async criar(auditoriaId: string, dto: CriarEvidenciaDto, arquivoPath: string) {
    return this.repo.create({ auditoriaId, tipo: dto.tipo, descricao: dto.descricao, fonte: dto.fonte, arquivoPath });
  }

  async listar(auditoriaId: string) {
    return this.repo.findMany({ where: { auditoriaId }, orderBy: { dataObtencao: 'desc' } });
  }
}
