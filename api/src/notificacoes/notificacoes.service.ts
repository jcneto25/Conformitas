import { Injectable, Inject } from '@nestjs/common';
import { INotificacaoRepository, NOTIFICACAO_REPOSITORY } from './repositories/notificacao.repository';
import { CriarNotificacaoParams, NotificarPerfilParams, NotificarUnidadeParams } from './notificacao.types';

@Injectable()
export class NotificacoesService {
  constructor(@Inject(NOTIFICACAO_REPOSITORY) private readonly repo: INotificacaoRepository) {}

  async criar(params: CriarNotificacaoParams) {
    return this.repo.create({ usuarioId: params.usuarioId, tipo: params.tipo, mensagem: params.mensagem, auditoriaId: params.auditoriaId });
  }

  async listar(usuarioId: string) {
    return this.repo.findMany({ where: { usuarioId }, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async marcarLida(id: string, usuarioId: string) {
    return this.repo.updateMany({ id, usuarioId }, { lida: true });
  }

  async listarNaoLidas(usuarioId: string) {
    return this.repo.findMany({ where: { usuarioId, lida: false }, orderBy: { createdAt: 'desc' } });
  }

  async notificarPorPerfil(params: NotificarPerfilParams) {
    const perfis = await this.repo.findPerfisWithUsuario({ perfil: { codigo: params.codigoPerfil }, ativo: true, usuario: { ativo: true } });
    if (perfis.length === 0) return;
    await this.repo.createMany(perfis.map((up: any) => ({ usuarioId: up.usuario.id, tipo: params.tipo, mensagem: params.mensagem, auditoriaId: params.auditoriaId })));
  }

  async notificarGestoresUnidade(params: NotificarUnidadeParams) {
    if (!params.unidade) return;
    const perfisP05 = await this.repo.findPerfisWithUsuario({ perfil: { codigo: 'P05' }, unidadeEscopo: params.unidade, ativo: true, usuario: { ativo: true } });
    if (perfisP05.length === 0) return;
    await this.repo.createMany(perfisP05.map((up: any) => ({ usuarioId: up.usuario.id, tipo: params.tipo, mensagem: params.mensagem, auditoriaId: params.auditoriaId })));
  }
}
