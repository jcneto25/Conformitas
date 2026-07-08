jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hash123'),
  compare: jest.fn().mockResolvedValue(true),
}));
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AUTH_REPOSITORY } from './repositories/auth.repository';

describe('AuthService', () => {
  let service: AuthService;
  let repo: any;
  let jwtService: jest.Mocked<JwtService>;

  const mockRepo = () => ({
    findUsuario: jest.fn(),
    updateUsuario: jest.fn(),
    createLog: jest.fn(),
    createRefreshToken: jest.fn(),
    findRefreshToken: jest.fn(),
    revokeRefreshToken: jest.fn(),
    revokeUserRefreshTokens: jest.fn(),
    createSessaoMfa: jest.fn().mockResolvedValue({ id: 'mfa-session-id' }),
    findSessaoMfa: jest.fn(),
    deleteSessaoMfa: jest.fn(),
    getConfig: jest.fn(),
  });

  const mockUser = {
    id: 'uuid-1',
    nome: 'Admin',
    email: 'admin@audin.tjce.gov.br',
    matricula: 'ADM001',
    cargo: 'Administrador',
    unidade: 'AUDIN',
    senhaHash: 'hash123',
    mfaEnabled: false,
    mfaSecret: null,
    ativo: true,
    tentativasLogin: 0,
    bloqueadoAte: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    usuariosPerfis: [{ perfil: { codigo: 'P10', nome: 'Administrador', nivelAcesso: 'SISTEMA' } }],
  } as any;

  beforeEach(async () => {
    const mockJwt = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
      signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
    } as any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AUTH_REPOSITORY, useValue: mockRepo() },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    repo = module.get(AUTH_REPOSITORY);
    jwtService = module.get(JwtService) as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('deve autenticar com credenciais válidas', async () => {
      repo.findUsuario.mockResolvedValue(mockUser);
      repo.getConfig.mockResolvedValue(null);
      const result = await service.login('admin@audin.tjce.gov.br', 'Valid@123');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('deve rejeitar email inexistente', async () => {
      repo.findUsuario.mockResolvedValue(null);
      await expect(service.login('x@y.com', '123')).rejects.toThrow(UnauthorizedException);
    });

    it('deve rejeitar usuário inativo', async () => {
      repo.findUsuario.mockResolvedValue({ ...mockUser, ativo: false });
      await expect(service.login('inativo@test.com', '123')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('deve revogar tokens e registrar log', async () => {
      repo.revokeUserRefreshTokens.mockResolvedValue({ count: 1 });
      repo.createLog.mockResolvedValue({ id: 'log-1' });
      const result = await service.logout('user-1');
      expect(result.mensagem).toBe('Logout realizado');
      expect(repo.revokeUserRefreshTokens).toHaveBeenCalledWith('user-1');
    });
  });
});
