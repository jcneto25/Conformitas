import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUsuarioRepository, USUARIO_REPOSITORY } from './usuario.repository';

@Injectable()
export class PrismaUsuarioRepository implements IUsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return this.prisma.usuario.create({ data, include: { usuariosPerfis: { where: { ativo: true }, include: { perfil: true } } } }); }
  async findMany(where: any) { return this.prisma.usuario.findMany(where); }
  async findUnique(id: string, include?: any) { return this.prisma.usuario.findUnique({ where: { id }, include }); }
  async findByEmail(email: string, include?: any) { return this.prisma.usuario.findUnique({ where: { email }, include }); }
  async update(id: string, data: any) { return this.prisma.usuario.update({ where: { id }, data, include: { usuariosPerfis: { where: { ativo: true }, include: { perfil: true } } } }); }
}
