import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ICapacitacaoRepository,
  buildCreateData,
  buildUpdateData,
  CAPACITACAO_REPOSITORY,
} from './repositories/capacitacao.repository';
import { CreateCapacitacaoDto } from './dto/create-capacitacao.dto';
import { UpdateCapacitacaoDto } from './dto/update-capacitacao.dto';

@Injectable()
export class CapacitacoesService {
  constructor(@Inject(CAPACITACAO_REPOSITORY) private readonly repo: ICapacitacaoRepository) {}

  async create(dto: CreateCapacitacaoDto) {
    return this.repo.create(buildCreateData(dto));
  }

  async findAll(params?: { tipo?: string; participanteId?: string }) {
    return this.repo.findMany({ tipo: params?.tipo, participanteId: params?.participanteId });
  }

  async findOne(id: string) {
    const item = await this.repo.findUnique(id);
    if (!item) throw new NotFoundException('Capacitação não encontrada');
    return item;
  }

  async update(id: string, dto: UpdateCapacitacaoDto) {
    await this.findOne(id);
    return this.repo.update(id, buildUpdateData(dto));
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.delete(id);
  }

  async totalizarHoras(participanteId: string, ano?: number) {
    const year = ano || new Date().getFullYear();
    const capacitacoes = await this.repo.findMany({
      participanteId,
      ano: year,
    });
    const horasRealizadas = capacitacoes.reduce((sum: number, c: any) => sum + c.cargaHoraria, 0);
    return { participanteId, ano: year, horasRealizadas, totalCapacitacoes: capacitacoes.length };
  }

  async alertaMeta(participanteId: string) {
    const year = new Date().getFullYear();
    const config = await this.repo.findConfig('meta_horas_capacitacao_anual');
    const meta = config ? parseInt(config.valor, 10) : 40;
    const { horasRealizadas } = await this.totalizarHoras(participanteId, year);
    const faltam = Math.max(0, meta - horasRealizadas);
    return {
      meta,
      horasRealizadas,
      faltam,
      alerta: faltam > 0 ? `Meta de ${meta}h/ano: faltam ${faltam}h` : `Meta de ${meta}h/ano atingida!`,
    };
  }
}
