import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCapacitacaoDto } from './dto/create-capacitacao.dto';
import { UpdateCapacitacaoDto } from './dto/update-capacitacao.dto';

@Injectable()
export class CapacitacoesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCapacitacaoDto) {
    return this.prisma.capacitacao.create({
      data: {
        titulo: dto.titulo,
        instituicao: dto.instituicao,
        cargaHoraria: dto.cargaHoraria,
        tipo: dto.tipo,
        dataInicio: new Date(dto.dataInicio),
        dataFim: dto.dataFim ? new Date(dto.dataFim) : null,
        participanteIds: dto.participanteIds,
        certificadoPath: dto.certificadoPath,
      },
    });
  }

  async findAll(params?: { tipo?: string; participanteId?: string }) {
    const where: any = {};
    if (params?.tipo) where.tipo = params.tipo;
    if (params?.participanteId) {
      where.participanteIds = { array_contains: params.participanteId };
    }
    return this.prisma.capacitacao.findMany({ where, orderBy: { dataInicio: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.capacitacao.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Capacitação não encontrada');
    return item;
  }

  async update(id: string, dto: UpdateCapacitacaoDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.dataInicio) data.dataInicio = new Date(dto.dataInicio);
    if (dto.dataFim) data.dataFim = new Date(dto.dataFim);
    return this.prisma.capacitacao.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.capacitacao.delete({ where: { id } });
  }

  async totalizarHoras(participanteId: string, ano?: number) {
    const year = ano || new Date().getFullYear();
    const capacitacoes = await this.prisma.capacitacao.findMany({
      where: {
        participanteIds: { array_contains: participanteId },
        dataInicio: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
    });
    const horasRealizadas = capacitacoes.reduce((sum, c) => sum + c.cargaHoraria, 0);
    return { participanteId, ano: year, horasRealizadas, totalCapacitacoes: capacitacoes.length };
  }

  async alertaMeta(participanteId: string) {
    const year = new Date().getFullYear();
    const config = await this.prisma.configuracaoSistema.findUnique({
      where: { chave: 'meta_horas_capacitacao_anual' },
    });
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
