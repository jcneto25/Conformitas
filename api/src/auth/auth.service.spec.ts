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
    id: 'uuid-1', nome: 'Admin', email: 'admin@audin.tjce.gov.br',
    matricula: 'ADM001', cargo: 'Administrador', unidade: 'AUDIN',
    senhaHash: 'hash123', mfaEnabled: false, mfaSecret: null,
    ativo: true, tentativasLogin: 0, bloqueadoAte: null,
    createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    usuariosPerfis: [{ perfil: { codigo: 'P10', nome: 'Administrador' } }],
  } as any;

  beforeEach(async () => {
    const mockJwt = { sign: jest.fn().mockReturnValue('mock-jwt-token') } as any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: AUTH_REPOSITORY, useValue: mockRepo() }, { provide: JwtService, useValue: mockJwt }],
    }).compile();
    service = module.get<AuthService>(AuthService);
    repo = module.get(AUTH_REPOSITORY);
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

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
  });

  describe('setupMfa', () => {
    it('deve gerar segredo TOTP quando senha está correta', async () => {
      const user = { ...mockUser, mfaSecret: null };
      repo.findUsuario.mockImplementation((id: string) => id === 'user-1' ? user : null);
      repo.updateUsuario.mockResolvedValue({ ...user, mfaSecret: 'fake-secret' });
      const result = await service.setupMfa('user-1', 'Valid@123');
      expect(result).toHaveProperty('secret');
      expect(result).toHaveProperty('qrCodeUrl');
      expect(repo.updateUsuario).toHaveBeenCalledWith('user-1', expect.objectContaining({ mfaSecret: expect.any(String) }));
    });
    it('deve rejeitar senha incorreta', async () => {
      const { compare } = require('bcrypt');
      compare.mockResolvedValueOnce(false);
      repo.findUsuario.mockResolvedValue(mockUser);
      await expect(service.setupMfa('user-1', 'wrong')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('changePassword', () => {
    beforeEach(() => {
      const { compare } = require('bcrypt');
      compare.mockResolvedValue(true);
    });
    it('deve alterar senha quando atual está correta', async () => {
      repo.findUsuario.mockResolvedValue(mockUser);
      repo.updateUsuario.mockResolvedValue(mockUser);
      const result = await service.changePassword('user-1', 'Valid@123', 'Nova@456');
      expect(result).toHaveProperty('mensagem');
      expect(repo.updateUsuario).toHaveBeenCalledWith('user-1', expect.objectContaining({ senhaHash: 'hash123' }));
    });
    it('deve rejeitar senha atual incorreta', async () => {
      const { compare } = require('bcrypt');
      compare.mockResolvedValue(false);
      repo.findUsuario.mockResolvedValue(mockUser);
      await expect(service.changePassword('user-1', 'wrong', 'Nova@456')).rejects.toThrow(UnauthorizedException);
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
