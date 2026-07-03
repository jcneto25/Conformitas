import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificacoesService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(usuarioId: string, tipo: string, mensagem: string, auditoriaId?: string) {
    return this.prisma.notificacao.create({
      data: { usuarioId, tipo, mensagem, auditoriaId },
    });
  }

  async listar(usuarioId: string) {
    return this.prisma.notificacao.findMany({
      where: { usuarioId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async marcarLida(id: string, usuarioId: string) {
    return this.prisma.notificacao.updateMany({
      where: { id, usuarioId },
      data: { lida: true },
    });
  }

  async listarNaoLidas(usuarioId: string) {
    return this.prisma.notificacao.findMany({
      where: { usuarioId, lida: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Fan-out por perfil / unidade ──────────────
  // Promovido do AuditoriasService para reuso transversal (PRP-006 achados, etc.).

  /** Notifica todos os usuários ativos com o perfil informado (ex.: 'P02'). */
  async notificarPorPerfil(codigoPerfil: string, tipo: string, mensagem: string, auditoriaId?: string) {
    const perfis = await this.prisma.usuarioPerfil.findMany({
      where: { perfil: { codigo: codigoPerfil }, ativo: true, usuario: { ativo: true } },
      include: { usuario: true },
    });
    if (perfis.length === 0) return;
    await this.prisma.notificacao.createMany({
      data: perfis.map((up) => ({ usuarioId: up.usuario.id, tipo, mensagem, auditoriaId })),
    });
  }

  /**
   * Notifica todos os gestores (P05) ativos da unidade auditada.
   * Usado ao enviar um achado para manifestação (RF-006.3).
   */
  async notificarGestoresUnidade(unidade: string | null, tipo: string, mensagem: string, auditoriaId?: string) {
    if (!unidade) return;
    const perfisP05 = await this.prisma.usuarioPerfil.findMany({
      where: {
        perfil: { codigo: 'P05' },
        unidadeEscopo: unidade,
        ativo: true,
        usuario: { ativo: true },
      },
      include: { usuario: true },
    });
    if (perfisP05.length === 0) return;
    await this.prisma.notificacao.createMany({
      data: perfisP05.map((up) => ({ usuarioId: up.usuario.id, tipo, mensagem, auditoriaId })),
    });
  }
}
