import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { PrismaService } from '../prisma/prisma.service';
import appConfig from '../config/app.config';

interface MfaSession {
  usuarioId: string;
  createdAt: Date;
}

@Injectable()
export class AuthService {
  private mfaSessions = new Map<string, MfaSession>();

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
      const novasTentativas = usuario.tentativasLogin + 1;
      const dadosBloqueio: any = { tentativasLogin: novasTentativas };

      if (novasTentativas >= 5) {
        dadosBloqueio.bloqueadoAte = new Date(Date.now() + 30 * 60 * 1000);
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
          detalhes: { tentativas: novasTentativas },
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
      this.mfaSessions.set(sessionToken, {
        usuarioId: usuario.id,
        createdAt: new Date(),
      });

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
    const session = this.mfaSessions.get(sessionToken);

    if (!session) {
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
      this.mfaSessions.delete(sessionToken);
      throw new UnauthorizedException('Usuário não encontrado ou MFA não configurado');
    }

    const isValid = authenticator.verify({
      token: totpCode,
      secret: usuario.mfaSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Código TOTP inválido');
    }

    this.mfaSessions.delete(sessionToken);
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

    const accessToken = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
      roles,
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
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      const char = token.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}
