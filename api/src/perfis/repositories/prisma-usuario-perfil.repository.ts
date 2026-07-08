import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUsuarioPerfilRepository, USUARIO_PERFIL_REPOSITORY } from './usuario-perfil.repository';
@Injectable()
export class PrismaUsuarioPerfilRepository implements IUsuarioPerfilRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(where: any) { return this.prisma.usuarioPerfil.findMany(where); }
  async findUnique(id: string) { return this.prisma.usuarioPerfil.findUnique({ where: { id } }); }
  async create(data: any) { return this.prisma.usuarioPerfil.create({ data }); }
  async update(id: string, data: any) { return this.prisma.usuarioPerfil.update({ where: { id }, data }); }
}
