import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IAuthRepository, AUTH_REPOSITORY } from './auth.repository';
@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findUsuario(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
      include: { usuariosPerfis: { where: { ativo: true }, include: { perfil: true } } },
    });
  }
  async createLog(data: any) {
    return this.prisma.logSistema.create({ data });
  }
  async updateUsuario(id: string, data: any) {
    return this.prisma.usuario.update({ where: { id }, data });
  }
  async createRefreshToken(data: any) {
    return this.prisma.refreshToken.create({ data });
  }
  async findRefreshToken(tokenHash: string) {
    return this.prisma.refreshToken.findFirst({ where: { tokenHash } });
  }
  async revokeRefreshToken(id: string) {
    return this.prisma.refreshToken.update({ where: { id }, data: { revoked: true } });
  }
  async revokeUserRefreshTokens(usuarioId: string) {
    return this.prisma.refreshToken.updateMany({ where: { usuarioId, revoked: false }, data: { revoked: true } });
  }
  async createSessaoMfa(data: any) {
    return this.prisma.sessaoMfa.create({ data });
  }
  async findSessaoMfa(sessionToken: string) {
    return this.prisma.sessaoMfa.findUnique({ where: { sessionToken } });
  }
  async deleteSessaoMfa(id: string) {
    return this.prisma.sessaoMfa.delete({ where: { id } });
  }
  async getConfig(chave: string): Promise<string | null> {
    const c = await this.prisma.configuracaoSistema.findUnique({ where: { chave } });
    return c?.valor ?? null;
  }
}
