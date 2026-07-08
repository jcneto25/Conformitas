import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUsuarioRepository, USUARIO_REPOSITORY } from './repositories/usuario.repository';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
const SALT_ROUNDS = 12;
@Injectable()
export class UsuariosService {
  constructor(@Inject(USUARIO_REPOSITORY) private readonly repo: IUsuarioRepository) {}
  async create(dto: CreateUsuarioDto) {
    const senhaHash = await bcrypt.hash(dto.senha, SALT_ROUNDS);
    try {
      const usuario = await this.repo.create({
        nome: dto.nome,
        email: dto.email,
        matricula: dto.matricula,
        cargo: dto.cargo,
        unidade: dto.unidade,
        senhaHash,
      });
      const { senhaHash: _sh, ...result } = usuario;
      return result;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        const target = error.meta?.target || [];
        throw new ConflictException(`Usuário com este ${target.includes('email') ? 'email' : 'matricula'} já existe`);
      }
      throw error;
    }
  }
  async findAll() {
    const usuarios = await this.repo.findMany({
      where: { deletedAt: null },
      include: { usuariosPerfis: { where: { ativo: true }, include: { perfil: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return usuarios.map(({ senhaHash: _sh, ...rest }: any) => rest);
  }
  async findOne(id: string) {
    const usuario = await this.repo.findUnique(id, {
      usuariosPerfis: { where: { ativo: true }, include: { perfil: true } },
    });
    if (!usuario || usuario.deletedAt) throw new NotFoundException('Usuário não encontrado');
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
    const usuario = await this.repo.update(id, data);
    const { senhaHash: _sh, ...result } = usuario;
    return result;
  }
  async deactivate(id: string) {
    await this.findOne(id);
    return this.repo.update(id, { ativo: false, dataDesativacao: new Date() });
  }
  async findByEmail(email: string) {
    return this.repo.findByEmail(email, { usuariosPerfis: { where: { ativo: true }, include: { perfil: true } } });
  }
}
