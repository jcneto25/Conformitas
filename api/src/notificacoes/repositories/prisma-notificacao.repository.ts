import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { INotificacaoRepository, NotificacaoReadModel } from './notificacao.repository';

function mapNotificacao(raw: any): NotificacaoReadModel {
  return { id: raw.id, usuarioId: raw.usuarioId, tipo: raw.tipo, mensagem: raw.mensagem,
    auditoriaId: raw.auditoriaId, lida: raw.lida, createdAt: raw.createdAt, updatedAt: raw.updatedAt };
}

@Injectable()
export class PrismaNotificacaoRepository implements INotificacaoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) { return mapNotificacao(await this.prisma.notificacao.create({ data })); }
  async findMany(where: any) { return (await this.prisma.notificacao.findMany(where)).map(mapNotificacao); }
  async updateMany(where: any, data: any) { return this.prisma.notificacao.updateMany({ where, data }); }
  async createMany(data: any[]) { return this.prisma.notificacao.createMany({ data }); }
  async findPerfisWithUsuario(where: any) { return this.prisma.usuarioPerfil.findMany({ where, include: { usuario: true } }); }
}
