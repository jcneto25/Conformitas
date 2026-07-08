import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRiscoRepository, RISCO_REPOSITORY } from './repositories/risco.repository';
import { CreateRiscoDto } from './dto/create-risco.dto';
import { UpdateRiscoDto } from './dto/update-risco.dto';
@Injectable()
export class RiscosService {
  constructor(@Inject(RISCO_REPOSITORY) private readonly repo: IRiscoRepository) {}
  private calcularNivel(probabilidade: number, impacto: number): string {
    const score = probabilidade * impacto;
    if (score <= 5) return 'BAIXO';
    if (score <= 10) return 'MEDIO';
    if (score <= 15) return 'ALTO';
    if (score <= 20) return 'CRITICO';
    return 'EXTREMO';
  }
  async create(dto: CreateRiscoDto) {
    return this.repo.create({ ...dto, nivel: this.calcularNivel(dto.probabilidade, dto.impacto) });
  }
  async findAll(params?: { categoria?: string; status?: string; nivel?: string }) {
    return this.repo.findMany({ categoria: params?.categoria, status: params?.status, nivel: params?.nivel });
  }
  async findOne(id: string) {
    const item = await this.repo.findUnique(id);
    if (!item) throw new NotFoundException('Risco não encontrado');
    return item;
  }
  async update(id: string, dto: UpdateRiscoDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.probabilidade !== undefined || dto.impacto !== undefined) {
      const atual = await this.repo.findUnique(id);
      if (atual)
        data.nivel = this.calcularNivel(dto.probabilidade ?? atual.probabilidade, dto.impacto ?? atual.impacto);
    }
    return this.repo.update(id, data);
  }
  async remove(id: string) {
    await this.findOne(id);
    return this.repo.delete(id);
  }
  async matrizRiscos() {
    const riscos = await this.repo.findMany({});
    const agrupado = { BAIXO: 0, MEDIO: 0, ALTO: 0, CRITICO: 0, EXTREMO: 0 };
    for (const r of riscos) {
      agrupado[r.nivel as keyof typeof agrupado]++;
    }
    return { riscos, agrupado, total: riscos.length };
  }
  async resumoPorCategoria() {
    const riscos = await this.repo.findMany({});
    const mapa: Record<string, { total: number; medio: number }> = {};
    for (const r of riscos) {
      const cat = r.categoria || 'SEM_CATEGORIA';
      if (!mapa[cat]) mapa[cat] = { total: 0, medio: 0 };
      mapa[cat].total++;
      mapa[cat].medio += r.probabilidade * r.impacto;
    }
    return Object.entries(mapa).map(([categoria, v]) => ({
      categoria,
      total: v.total,
      scoreMedio: Math.round(v.medio / v.total),
    }));
  }
}
