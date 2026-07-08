import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPerfilRepository, PERFIL_REPOSITORY } from './repositories/perfil.repository';
import { IUsuarioPerfilRepository, USUARIO_PERFIL_REPOSITORY } from './repositories/usuario-perfil.repository';
@Injectable()
export class PerfisService {
  constructor(
    @Inject(PERFIL_REPOSITORY) private readonly perfilRepo: IPerfilRepository,
    @Inject(USUARIO_PERFIL_REPOSITORY) private readonly usuarioPerfilRepo: IUsuarioPerfilRepository,
  ) {}
  async findAll() {
    return this.perfilRepo.findAll();
  }
  async findOne(id: string) {
    const p = await this.perfilRepo.findUnique(id);
    if (!p) throw new NotFoundException('Perfil não encontrado');
    return p;
  }
  async findByCodigo(codigo: string) {
    return this.perfilRepo.findByCodigo(codigo);
  }
  async atribuirPerfil(usuarioId: string, perfilId: string, unidadeEscopo?: string) {
    const perfisAtuais = await this.usuarioPerfilRepo.findMany({
      where: { usuarioId, ativo: true },
      include: { perfil: true },
    });
    const perfilNovo = await this.perfilRepo.findUnique(perfilId);
    if (!perfilNovo) throw new NotFoundException('Perfil não encontrado');
    if (perfilNovo.codigo === 'P01' && perfisAtuais.length > 0)
      throw new Error('SOD_VIOLATION: Usuário P01 não pode acumular outros perfis');
    if (perfisAtuais.some((up: any) => up.perfil.codigo === 'P01') && perfilNovo.codigo !== 'P01')
      throw new Error('SOD_VIOLATION: Usuário P01 não pode acumular outros perfis');
    if (perfilNovo.codigo !== 'P10' && perfisAtuais.some((up: any) => up.perfil.codigo === 'P10'))
      throw new Error('SOD_VIOLATION: Usuário P10 não pode ter perfis de auditoria');
    if (unidadeEscopo && (perfilNovo.codigo === 'P02' || perfilNovo.codigo === 'P05')) {
      const outroCodigo = perfilNovo.codigo === 'P02' ? 'P05' : 'P02';
      if (perfisAtuais.find((up: any) => up.perfil.codigo === outroCodigo && up.unidadeEscopo === unidadeEscopo))
        throw new Error(`SOD_VIOLATION: Usuário não pode ter P02 e P05 na mesma unidade (${unidadeEscopo})`);
    }
    return this.usuarioPerfilRepo.create({ usuarioId, perfilId, unidadeEscopo: unidadeEscopo || null, ativo: true });
  }
  async removerPerfil(usuarioPerfilId: string) {
    const up = await this.usuarioPerfilRepo.findUnique(usuarioPerfilId);
    if (!up) throw new NotFoundException('Vínculo de perfil não encontrado');
    return this.usuarioPerfilRepo.update(usuarioPerfilId, { ativo: false, dataFim: new Date() });
  }
  async listarPerfisUsuario(usuarioId: string) {
    return this.usuarioPerfilRepo.findMany({ where: { usuarioId, ativo: true }, include: { perfil: true } });
  }
}
