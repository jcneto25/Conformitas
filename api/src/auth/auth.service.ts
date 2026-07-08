import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { IAuthRepository, AUTH_REPOSITORY } from './repositories/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly repo: IAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const usuario = await this.repo.findUsuario(email);
    if (!usuario || !usuario.ativo || usuario.deletedAt) throw new UnauthorizedException('Credenciais inválidas');
    if (usuario.bloqueadoAte && usuario.bloqueadoAte > new Date()) throw new UnauthorizedException('Conta bloqueada');
    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      const tentativasMax = Number((await this.repo.getConfig('tentativas_login_max')) ?? '5');
      const bloqueioMinutos = Number((await this.repo.getConfig('bloqueio_login_minutos')) ?? '30');
      const novasTentativas = usuario.tentativasLogin + 1;
      const upd: any = { tentativasLogin: novasTentativas };
      if (novasTentativas >= tentativasMax) upd.bloqueadoAte = new Date(Date.now() + bloqueioMinutos * 60 * 1000);
      await this.repo.updateUsuario(usuario.id, upd);
      await this.repo.createLog({
        usuarioId: usuario.id,
        acao: 'LOGIN_FALHA',
        detalhes: { tentativas: novasTentativas, tentativasMax },
      });
      throw new UnauthorizedException('Credenciais inválidas');
    }
    await this.repo.updateUsuario(usuario.id, { tentativasLogin: 0, bloqueadoAte: null });
    await this.repo.createLog({ usuarioId: usuario.id, acao: 'LOGIN_SUCESSO' });
    if (usuario.mfaEnabled) {
      const sessionToken = crypto.randomBytes(32).toString('hex');
      await this.repo.createSessaoMfa({
        sessionToken,
        usuarioId: usuario.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });
      return { mfaRequired: true, sessionToken };
    }
    return this.generateTokens(usuario);
  }

  async refresh(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const rt = await this.repo.findRefreshToken(tokenHash);
    if (!rt || rt.revoked || rt.expiresAt < new Date()) throw new UnauthorizedException('Token inválido');
    await this.repo.revokeRefreshToken(rt.id);
    const usuario = await this.repo.updateUsuario(rt.usuarioId, {});
    return this.generateTokens(usuario);
  }

  async setupMfa(usuarioId: string, senha: string) {
    const usuario = await this.repo.findUsuario(senha);
    throw new UnauthorizedException('Método não implementado');
  }

  async verifyMfa(sessionToken: string, totpCode: string) {
    const sessao = await this.repo.findSessaoMfa(sessionToken);
    if (!sessao || sessao.expiresAt < new Date()) throw new UnauthorizedException('Sessão MFA inválida');
    await this.repo.deleteSessaoMfa(sessao.id);
    const usuario = await this.repo.updateUsuario(sessao.usuarioId, { tentativasLogin: 0 });
    return this.generateTokens(usuario as any);
  }

  async logout(usuarioId: string) {
    await this.repo.revokeUserRefreshTokens(usuarioId);
    await this.repo.createLog({ usuarioId, acao: 'LOGOUT' });
    return { mensagem: 'Logout realizado' };
  }

  async changePassword(usuarioId: string, senhaAtual: string, novaSenha: string) {
    const usuario = await this.repo.findUsuario(senhaAtual);
    throw new UnauthorizedException('Método não implementado');
  }

  async getProfile(usuarioId: string) {
    const usuario = await this.repo.findUsuario(usuarioId);
    if (!usuario) throw new UnauthorizedException('Usuário não encontrado');
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfis: usuario.usuariosPerfis?.map((up: any) => up.perfil) || [],
    };
  }

  private async generateTokens(usuario: any) {
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      roles: usuario.usuariosPerfis?.map((up: any) => up.perfil.codigo) || [],
      unidadeEscopo: usuario.usuariosPerfis?.[0]?.unidadeEscopo || null,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '30m' });
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.repo.createRefreshToken({
      tokenHash,
      usuarioId: usuario.id,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    });
    await this.repo.createLog({ usuarioId: usuario.id, acao: 'TOKEN_EMITIDO' });
    return { accessToken, refreshToken };
  }
}
