import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  usuario: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  refreshToken: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  sessaoMfa: {
    findUnique: jest.fn(),
    create: jest.fn().mockResolvedValue({ id: 'mfa-session-id' }),
    delete: jest.fn(),
    deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
  },
  configuracaoSistema: {
    findUnique: jest.fn(),
  },
  logSistema: {
    create: jest.fn(),
  },
});

describe('AuthService', () => {
  let service: AuthService;
  let prisma: ReturnType<typeof mockPrisma>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'uuid-1',
    nome: 'Admin',
    email: 'admin@audin.tjce.gov.br',
    matricula: 'ADM001',
    cargo: 'Administrador',
    unidade: 'AUDIN',
    senhaHash: '',
    mfaEnabled: false,
    mfaSecret: null,
    ativo: true,
    dataDesativacao: null,
    tentativasLogin: 0,
    bloqueadoAte: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    usuariosPerfis: [{ perfil: { codigo: 'P10', nome: 'Administrador', nivelAcesso: 'SISTEMA' } }],
  } as any;

  beforeAll(async () => {
    mockUser.senhaHash = await bcrypt.hash('Valid@123', 12);
  });

  beforeEach(async () => {
    const mockJwt = {
      signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma() },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService) as any;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
  });

  describe('login', () => {
    it('deve retornar tokens para credenciais válidas sem MFA', async () => {
      prisma.usuario.findUnique.mockResolvedValue(mockUser);

      const result = await service.login(mockUser.email, 'Valid@123');

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('expires_in', 1800);
    });

    it('deve lançar UnauthorizedException para senha inválida', async () => {
      prisma.usuario.findUnique.mockResolvedValue(mockUser);

      await expect(service.login(mockUser.email, 'WrongPassword')).rejects.toThrow(UnauthorizedException);
    });

    it('deve bloquear conta após 5 tentativas falhas', async () => {
      const userWithAttempts = { ...mockUser, tentativasLogin: 4 };
      prisma.usuario.findUnique.mockResolvedValue(userWithAttempts);

      await expect(service.login(userWithAttempts.email, 'WrongPassword')).rejects.toThrow(UnauthorizedException);

      expect(prisma.usuario.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: userWithAttempts.email },
          data: expect.objectContaining({
            tentativasLogin: 5,
            bloqueadoAte: expect.any(Date),
          }),
        }),
      );
    });

    it('deve lançar UnauthorizedException para conta bloqueada', async () => {
      const futureDate = new Date(Date.now() + 3600000);
      const blockedUser = { ...mockUser, bloqueadoAte: futureDate };
      prisma.usuario.findUnique.mockResolvedValue(blockedUser);

      await expect(service.login(blockedUser.email, 'Valid@123')).rejects.toThrow('Conta bloqueada');
    });

    it('deve retornar mfa_required para usuários com MFA ativo', async () => {
      const mfaUser = { ...mockUser, mfaEnabled: true, mfaSecret: 'secret' };
      prisma.usuario.findUnique.mockResolvedValue(mfaUser);

      const result = await service.login(mfaUser.email, 'Valid@123');

      expect(result).toHaveProperty('mfa_required', true);
      expect(result).toHaveProperty('session_token');
    });

    it('deve lançar UnauthorizedException para usuário inativo', async () => {
      const inactiveUser = { ...mockUser, ativo: false };
      prisma.usuario.findUnique.mockResolvedValue(inactiveUser);

      await expect(service.login(inactiveUser.email, 'Valid@123')).rejects.toThrow(UnauthorizedException);
    });

    it('deve registrar log no login bem-sucedido', async () => {
      prisma.usuario.findUnique.mockResolvedValue(mockUser);

      await service.login(mockUser.email, 'Valid@123');

      expect(prisma.logSistema.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            acao: 'LOGIN_SUCESSO',
          }),
        }),
      );
    });
  });

  describe('refresh', () => {
    it('deve retornar novos tokens para refresh válido', async () => {
      const mockRefreshToken = {
        id: 'rt-uuid',
        tokenHash: 'abc123',
        usuarioId: mockUser.id,
        expiresAt: new Date(Date.now() + 28800000),
        revoked: false,
        createdAt: new Date(),
      };
      prisma.refreshToken.findFirst.mockResolvedValue(mockRefreshToken);
      prisma.usuario.findUnique.mockResolvedValue(mockUser);

      const result = await service.refresh('valid-refresh-token');

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(prisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockRefreshToken.id },
          data: { revoked: true },
        }),
      );
    });

    it('deve lançar UnauthorizedException para refresh revogado', async () => {
      prisma.refreshToken.findFirst.mockResolvedValue(null);

      await expect(service.refresh('invalid-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyMfa', () => {
    it('deve lançar UnauthorizedException para session_token inválido', async () => {
      prisma.sessaoMfa.findUnique.mockResolvedValue(null);

      await expect(service.verifyMfa('invalid-session', '123456')).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException para sessão expirada', async () => {
      prisma.sessaoMfa.findUnique.mockResolvedValue({
        id: 'expired-id',
        sessionToken: 'expired-session',
        usuarioId: mockUser.id,
        expiresAt: new Date(Date.now() - 1000),
        createdAt: new Date(),
      });
      prisma.sessaoMfa.delete.mockResolvedValue({} as any);

      await expect(service.verifyMfa('expired-session', '123456')).rejects.toThrow(UnauthorizedException);
      expect(prisma.sessaoMfa.delete).toHaveBeenCalled();
    });
  });
});
