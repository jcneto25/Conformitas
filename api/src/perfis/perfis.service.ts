import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PerfisService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.perfil.findMany({ orderBy: { codigo: 'asc' } });
  }

  async findOne(id: string) {
    const perfil = await this.prisma.perfil.findUnique({ where: { id } });
    if (!perfil) throw new NotFoundException('Perfil não encontrado');
    return perfil;
  }

  async findByCodigo(codigo: string) {
    return this.prisma.perfil.findUnique({ where: { codigo } });
  }

  async atribuirPerfil(usuarioId: string, perfilId: string, unidadeEscopo?: string) {
    // Validação SOD: P01 não acumula outros perfis
    const perfisAtuais = await this.prisma.usuarioPerfil.findMany({
      where: { usuarioId, ativo: true },
      include: { perfil: true },
    });

    const perfilNovo = await this.prisma.perfil.findUnique({ where: { id: perfilId } });
    if (!perfilNovo) throw new NotFoundException('Perfil não encontrado');

    if (perfilNovo.codigo === 'P01' && perfisAtuais.length > 0) {
      throw new Error('SOD_VIOLATION: Usuário P01 não pode acumular outros perfis');
    }

    const temP01 = perfisAtuais.some((up) => up.perfil.codigo === 'P01');
    if (temP01 && perfilNovo.codigo !== 'P01') {
      throw new Error('SOD_VIOLATION: Usuário P01 não pode acumular outros perfis');
    }

    // P10 não pode ter perfis de auditoria
    if (perfilNovo.codigo !== 'P10') {
      const ehP10 = perfisAtuais.some((up) => up.perfil.codigo === 'P10');
      if (ehP10) {
        throw new Error('SOD_VIOLATION: Usuário P10 não pode ter perfis de auditoria');
      }
    }

    return this.prisma.usuarioPerfil.create({
      data: {
        usuarioId,
        perfilId,
        unidadeEscopo: unidadeEscopo || null,
        ativo: true,
      },
      include: { perfil: true },
    });
  }

  async removerPerfil(usuarioPerfilId: string) {
    const up = await this.prisma.usuarioPerfil.findUnique({
      where: { id: usuarioPerfilId },
    });
    if (!up) throw new NotFoundException('Vínculo de perfil não encontrado');

    return this.prisma.usuarioPerfil.update({
      where: { id: usuarioPerfilId },
      data: { ativo: false, dataFim: new Date() },
    });
  }

  async listarPerfisUsuario(usuarioId: string) {
    return this.prisma.usuarioPerfil.findMany({
      where: { usuarioId, ativo: true },
      include: { perfil: true },
    });
  }
}
