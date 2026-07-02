import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUsuarioDto) {
    const senhaHash = await bcrypt.hash(dto.senha, SALT_ROUNDS);

    try {
      const usuario = await this.prisma.usuario.create({
        data: {
          nome: dto.nome,
          email: dto.email,
          matricula: dto.matricula,
          cargo: dto.cargo,
          unidade: dto.unidade,
          senhaHash,
        },
        include: {
          usuariosPerfis: {
            where: { ativo: true },
            include: { perfil: true },
          },
        },
      });

      const { senhaHash: _sh, ...result } = usuario;
      return result;
    } catch (error) {
      const prismaError = error as { code?: string; meta?: { target?: string[] } };
      if (prismaError?.code === 'P2002') {
        const target = prismaError.meta?.target || [];
        const field = target.includes('email') ? 'email' : 'matricula';
        throw new ConflictException(`Usuário com este ${field} já existe`);
      }
      throw error;
    }
  }

  async findAll() {
    const usuarios = await this.prisma.usuario.findMany({
      where: { deletedAt: null },
      include: {
        usuariosPerfis: {
          where: { ativo: true },
          include: { perfil: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return usuarios.map(({ senhaHash: _sh, ...rest }) => rest);
  }

  async findOne(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        usuariosPerfis: {
          where: { ativo: true },
          include: { perfil: true },
        },
      },
    });

    if (!usuario || usuario.deletedAt) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { senhaHash: _sh, ...result } = usuario;
    return result;
  }

  async update(id: string, dto: UpdateUsuarioDto) {
    await this.findOne(id);

    const data: any = { ...dto };
    if (dto.senha) {
      data.senhaHash = await bcrypt.hash(dto.senha, SALT_ROUNDS);
      delete data.senha;
    }

    const usuario = await this.prisma.usuario.update({
      where: { id },
      data,
      include: {
        usuariosPerfis: {
          where: { ativo: true },
          include: { perfil: true },
        },
      },
    });

    const { senhaHash: _sh, ...result } = usuario;
    return result;
  }

  async deactivate(id: string) {
    await this.findOne(id);

    await this.prisma.usuario.update({
      where: { id },
      data: {
        ativo: false,
        dataDesativacao: new Date(),
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
      include: {
        usuariosPerfis: {
          where: { ativo: true },
          include: { perfil: true },
        },
      },
    });
  }
}
