import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICompetenciaRepository, COMPETENCIA_REPOSITORY } from './repositories/competencia.repository';
import { CreateCompetenciaDto } from './dto/create-competencia.dto';
import { UpdateCompetenciaDto } from './dto/update-competencia.dto';

@Injectable()
export class CompetenciasService {
  constructor(@Inject(COMPETENCIA_REPOSITORY) private readonly repo: ICompetenciaRepository) {}

  async create(dto: CreateCompetenciaDto) {
    return this.repo.create(dto);
  }

  async findAll(params?: { tipo?: string }) {
    return this.repo.findMany({ tipo: params?.tipo });
  }

  async findOne(id: string) {
    const item = await this.repo.findUnique(id);
    if (!item) throw new NotFoundException('Competência não encontrada');
    return item;
  }

  async update(id: string, dto: UpdateCompetenciaDto) {
    await this.findOne(id);
    return this.repo.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.delete(id);
  }
}
