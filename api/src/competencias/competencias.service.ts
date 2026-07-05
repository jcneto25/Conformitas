import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetenciaDto } from './dto/create-competencia.dto';
import { UpdateCompetenciaDto } from './dto/update-competencia.dto';

@Injectable()
export class CompetenciasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCompetenciaDto) {
    return this.prisma.competencia.create({ data: dto });
  }

  async findAll(params?: { tipo?: string }) {
    const where: any = {};
    if (params?.tipo) where.tipo = params.tipo;
    return this.prisma.competencia.findMany({ where, orderBy: { nome: 'asc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.competencia.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Competência não encontrada');
    return item;
  }

  async update(id: string, dto: UpdateCompetenciaDto) {
    await this.findOne(id);
    return this.prisma.competencia.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.competencia.delete({ where: { id } });
  }
}
