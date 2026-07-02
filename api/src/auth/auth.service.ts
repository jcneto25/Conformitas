import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { PrismaService } from '../prisma/prisma.service';
import appConfig from '../config/app.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: {
        usuariosPerfis: {
          where: { ativo: true },
          include: { perfil: true },
        },
      },
    });

    if (!usuario || !usuario.ativo || usuario.deletedAt) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (usuario.bloqueadoAte && usuario.bloqueadoAte > new Date()) {
      throw new UnauthorizedException('Conta bloqueada. Contate o administrador.');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      const tentativasMax = Number(await this.getConfig('tentativas_login_max', '5'));
      const bloqueioMinutos = Number(await this.getConfig('bloqueio_login_minutos', '30'));

      const novasTentativas = usuario.tentativasLogin + 1;
      const dadosBloqueio: any = { tentativasLogin: novasTentativas };

      if (novasTentativas >= tentativasMax) {
        dadosBloqueio.bloqueadoAte = new Date(Date.now() + bloqueioMinutos * 60 * 1000);
      }

      await this.prisma.usuario.update({
        where: { email },
        data: dadosBloqueio,
      });

      await this.prisma.logSistema.create({
        data: {
          usuarioId: usuario.id,
          acao: 'LOGIN_FALHA',
          ip: null,
          userAgent: null,
          detalhes: { tentativas: novasTentativas, tentativasMax },
        },
      });

      throw new UnauthorizedException('Credenciais inválidas');
    }

    await this.prisma.usuario.update({
      where: { email },
      data: { tentativasLogin: 0, bloqueadoAte: null },
    });

    if (usuario.mfaEnabled) {
      const sessionToken = crypto.randomUUID();
      const mfaTtl = 5 * 60 * 1000; // 5 minutos

      await this.prisma.sessaoMfa.create({
        data: {
          sessionToken,
          usuarioId: usuario.id,
          expiresAt: new Date(Date.now() + mfaTtl),
        },
      });

      // Limpar sessões expiradas (fire-and-forget)
      this.prisma.sessaoMfa.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      }).catch(() => {});

      return { mfa_required: true, session_token: sessionToken };
    }

    return this.generateTokens(usuario);
  }

  async refresh(token: string) {
    const tokenHash = this.hashToken(token);

    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    await this.prisma.refreshToken.update({
      where: { id: refreshToken.id },
      data: { revoked: true },
    });

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: refreshToken.usuarioId },
      include: {
        usuariosPerfis: {
          where: { ativo: true },
          include: { perfil: true },
        },
      },
    });

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('Usuário não encontrado ou inativo');
    }

    return this.generateTokens(usuario);
  }

  async verifyMfa(sessionToken: string, totpCode: string) {
    const session = await this.prisma.sessaoMfa.findUnique({
      where: { sessionToken },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await this.prisma.sessaoMfa.delete({ where: { id: session.id } });
      }
      throw new UnauthorizedException('Sessão MFA inválida ou expirada');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: session.usuarioId },
      include: {
        usuariosPerfis: {
          where: { ativo: true },
          include: { perfil: true },
        },
      },
    });

    if (!usuario || !usuario.mfaSecret) {
      await this.prisma.sessaoMfa.delete({ where: { id: session.id } });
      throw new UnauthorizedException('Usuário não encontrado ou MFA não configurado');
    }

    const isValid = authenticator.verify({
      token: totpCode,
      secret: usuario.mfaSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Código TOTP inválido');
    }

    await this.prisma.sessaoMfa.delete({ where: { id: session.id } });
    return this.generateTokens(usuario);
  }

  async setupMfa(usuarioId: string, senha: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('Senha inválida');
    }

    const secret = authenticator.generateSecret();

    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        mfaSecret: secret,
        mfaEnabled: true,
      },
    });

    return {
      secret,
      qr_code_url: authenticator.keyuri(usuario.email, appConfig.totp.issuer, secret),
    };
  }

  async logout(usuarioId: string) {
    // Revogar todos os refresh tokens ativos do usuário
    await this.prisma.refreshToken.updateMany({
      where: { usuarioId, revoked: false },
      data: { revoked: true },
    });

    await this.prisma.logSistema.create({
      data: {
        usuarioId,
        acao: 'LOGOUT',
        ip: null,
        userAgent: null,
        detalhes: {},
      },
    });

    return { mensagem: 'Logout realizado com sucesso' };
  }

  async changePassword(usuarioId: string, senhaAtual: string, novaSenha: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario || !usuario.ativo || usuario.deletedAt) {
      throw new UnauthorizedException('Usuário não encontrado ou inativo');
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('Senha atual inválida');
    }

    const novaHash = await bcrypt.hash(novaSenha, 12);

    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { senhaHash: novaHash },
    });

    await this.prisma.logSistema.create({
      data: {
        usuarioId,
        acao: 'SENHA_ALTERADA',
        ip: null,
        userAgent: null,
        detalhes: {},
      },
    });

    return { mensagem: 'Senha alterada com sucesso' };
  }

  async getProfile(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: {
        usuariosPerfis: {
          where: { ativo: true },
          include: { perfil: true },
        },
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const { senhaHash: _, mfaSecret: __, ...profile } = usuario;
    return profile;
  }

  private async generateTokens(usuario: any) {
    const roles = usuario.usuariosPerfis?.map((up: any) => up.perfil.codigo) || [];
    const unidadeEscopo = usuario.usuariosPerfis?.find((up: any) => up.unidadeEscopo)?.unidadeEscopo || null;

    const accessToken = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
      roles,
      unidadeEscopo,
    });

    const refreshTokenRaw = crypto.randomUUID();
    const tokenHash = this.hashToken(refreshTokenRaw);
    const expiresAt = new Date(Date.now() + parseInt(appConfig.jwt.refreshExpiresIn) * 1000);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        usuarioId: usuario.id,
        expiresAt,
      },
    });

    await this.prisma.logSistema.create({
      data: {
        usuarioId: usuario.id,
        acao: 'LOGIN_SUCESSO',
        ip: null,
        userAgent: null,
        detalhes: { roles },
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshTokenRaw,
      expires_in: 1800,
    };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async getConfig(chave: string, padrao: string): Promise<string> {
    try {
      const config = await this.prisma.configuracaoSistema.findUnique({ where: { chave } });
      return config?.valor ?? padrao;
    } catch {
      return padrao;
    }
  }
}
