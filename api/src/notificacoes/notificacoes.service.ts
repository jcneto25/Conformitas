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
}
