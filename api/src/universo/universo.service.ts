import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IUniversoAuditavelRepository,
  buildCreateData,
  buildUpdateData,
  UNIVERSO_AUDITAVEL_REPOSITORY,
} from './repositories/universo-auditavel.repository';
import { CreateUniversoDto } from './dto/create-universo.dto';
import { UpdateUniversoDto } from './dto/update-universo.dto';

@Injectable()
export class UniversoService {
  constructor(@Inject(UNIVERSO_AUDITAVEL_REPOSITORY) private readonly repo: IUniversoAuditavelRepository) {}

  private calcularIndice(item: {
    materialidade: number;
    relevancia: number;
    criticidade: number;
    risco: number;
  }): number {
    return Math.pow(item.materialidade * item.relevancia * item.criticidade * item.risco, 1 / 4);
  }

  async create(dto: CreateUniversoDto) {
    const indicePriorizacao = this.calcularIndice(dto);
    return this.repo.create({ ...buildCreateData(dto), indicePriorizacao });
  }

  async findAll(params?: { tipo?: string; ativo?: boolean; search?: string }) {
    return this.repo.findMany({ tipo: params?.tipo, ativo: params?.ativo, search: params?.search });
  }

  async findOne(id: string) {
    const item = await this.repo.findUnique(id);
    if (!item || item.deletedAt) throw new NotFoundException('Item do universo não encontrado');
    return item;
  }

  async update(id: string, dto: UpdateUniversoDto) {
    await this.findOne(id);
    const data = buildUpdateData(dto);
    if (dto.materialidade || dto.relevancia || dto.criticidade || dto.risco) {
      const atual = await this.repo.findUnique(id);
      if (atual) {
        data.indicePriorizacao = this.calcularIndice({
          materialidade: dto.materialidade ?? atual.materialidade,
          relevancia: dto.relevancia ?? atual.relevancia,
          criticidade: dto.criticidade ?? atual.criticidade,
          risco: dto.risco ?? atual.risco,
        });
      }
    }
    return this.repo.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.update(id, { deletedAt: new Date(), ativo: false });
  }

  async matrizPriorizacao(horasDisponiveis?: number) {
    const itens = await this.repo.findMany({ ativo: true });
    if (!horasDisponiveis) return { itens, destaques: [] };
    let horasRestantes = horasDisponiveis;
    const destaques: string[] = [];
    for (const item of itens) {
      if (horasRestantes <= 0) break;
      destaques.push(item.id);
      horasRestantes -= 100;
    }
    return { itens, destaques };
  }
}
