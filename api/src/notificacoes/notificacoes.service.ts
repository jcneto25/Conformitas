import { Injectable, Inject } from '@nestjs/common';
import { INotificacaoRepository, NOTIFICACAO_REPOSITORY } from './repositories/notificacao.repository';
@Injectable()
export class NotificacoesService {
  constructor(@Inject(NOTIFICACAO_REPOSITORY) private readonly repo: INotificacaoRepository) {}
  async criar(usuarioId: string, tipo: string, mensagem: string, auditoriaId?: string) {
    return this.repo.create({ usuarioId, tipo, mensagem, auditoriaId });
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
  async notificarPorPerfil(codigoPerfil: string, tipo: string, mensagem: string, auditoriaId?: string) {
    const perfis = await this.repo.findPerfisWithUsuario({
      perfil: { codigo: codigoPerfil },
      ativo: true,
      usuario: { ativo: true },
    });
    if (perfis.length === 0) return;
    await this.repo.createMany(perfis.map((up: any) => ({ usuarioId: up.usuario.id, tipo, mensagem, auditoriaId })));
  }
  async notificarGestoresUnidade(unidade: string | null, tipo: string, mensagem: string, auditoriaId?: string) {
    if (!unidade) return;
    const perfisP05 = await this.repo.findPerfisWithUsuario({
      perfil: { codigo: 'P05' },
      unidadeEscopo: unidade,
      ativo: true,
      usuario: { ativo: true },
    });
    if (perfisP05.length === 0) return;
    await this.repo.createMany(perfisP05.map((up: any) => ({ usuarioId: up.usuario.id, tipo, mensagem, auditoriaId })));
  }
}
