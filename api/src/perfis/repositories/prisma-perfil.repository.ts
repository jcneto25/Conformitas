import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IPerfilRepository, PERFIL_REPOSITORY } from './perfil.repository';
@Injectable()
export class PrismaPerfilRepository implements IPerfilRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() { return this.prisma.perfil.findMany({ orderBy: { codigo: 'asc' } }); }
  async findUnique(id: string) { return this.prisma.perfil.findUnique({ where: { id } }); }
  async findByCodigo(codigo: string) { return this.prisma.perfil.findUnique({ where: { codigo } }); }
}
