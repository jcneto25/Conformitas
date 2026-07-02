import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { MfaVerifyDto } from './dto/mfa-verify.dto';

type MockAuthService = {
  [K in keyof AuthService]: jest.Mock;
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: MockAuthService;

  beforeEach(async () => {
    const mockAuthService: MockAuthService = {
      login: jest.fn(),
      refresh: jest.fn(),
      verifyMfa: jest.fn(),
      setupMfa: jest.fn(),
      getProfile: jest.fn(),
      changePassword: jest.fn(),
      logout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService) as MockAuthService;
  });

  describe('POST /auth/login', () => {
    it('deve chamar authService.login com email e senha', async () => {
      const dto: LoginDto = { email: 'test@test.com', senha: '123456' };
      authService.login.mockResolvedValue({ access_token: 'token', refresh_token: 'rt', expires_in: 1800 });

      const result = await controller.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto.email, dto.senha);
      expect(result).toHaveProperty('access_token');
    });
  });

  describe('POST /auth/refresh', () => {
    it('deve chamar authService.refresh com o token', async () => {
      const dto: RefreshDto = { refresh_token: 'my-refresh-token' };
      authService.refresh.mockResolvedValue({ access_token: 'new-token', refresh_token: 'new-rt', expires_in: 1800 });

      const result = await controller.refresh(dto);

      expect(authService.refresh).toHaveBeenCalledWith(dto.refresh_token);
      expect(result).toHaveProperty('access_token');
    });
  });

  describe('POST /auth/mfa/verify', () => {
    it('deve chamar authService.verifyMfa', async () => {
      const dto: MfaVerifyDto = { session_token: 'sess-token', totp_code: '123456' };
      authService.verifyMfa.mockResolvedValue({ access_token: 'token', refresh_token: 'rt', expires_in: 1800 });

      const result = await controller.verifyMfa(dto);

      expect(authService.verifyMfa).toHaveBeenCalledWith(dto.session_token, dto.totp_code);
      expect(result).toHaveProperty('access_token');
    });
  });

  describe('POST /auth/mfa/setup', () => {
    it('deve chamar authService.setupMfa com usuário logado', async () => {
      const mockReq = { user: { sub: 'user-uuid', email: 'test@test.com', roles: ['P10'] } };
      authService.setupMfa.mockResolvedValue({ secret: 'secret', qr_code_url: 'otpauth://...' });

      const result = await controller.setupMfa(mockReq as any, { senha: 'Valid@123' });

      expect(authService.setupMfa).toHaveBeenCalledWith('user-uuid', 'Valid@123');
      expect(result).toHaveProperty('secret');
    });
  });

  describe('GET /auth/profile', () => {
    it('deve chamar authService.getProfile com usuário logado', async () => {
      const mockReq = { user: { sub: 'user-uuid', email: 'test@test.com', roles: ['P10'] } };
      authService.getProfile.mockResolvedValue({ id: 'user-uuid', nome: 'Test', email: 'test@test.com' });

      const result = await controller.getProfile(mockReq as any);

      expect(authService.getProfile).toHaveBeenCalledWith('user-uuid');
      expect(result).toHaveProperty('email');
    });
  });

  describe('PATCH /auth/change-password', () => {
    it('deve chamar authService.changePassword com senha atual e nova senha', async () => {
      const mockReq = { user: { sub: 'user-uuid', email: 'test@test.com', roles: ['P10'] } };
      authService.changePassword.mockResolvedValue({ mensagem: 'Senha alterada com sucesso' });

      const result = await controller.changePassword(mockReq as any, { senha_atual: 'Old@123', nova_senha: 'New@123456' });

      expect(authService.changePassword).toHaveBeenCalledWith('user-uuid', 'Old@123', 'New@123456');
      expect(result).toHaveProperty('mensagem');
    });
  });

  describe('POST /auth/logout', () => {
    it('deve chamar authService.logout com usuário logado', async () => {
      const mockReq = { user: { sub: 'user-uuid', email: 'test@test.com', roles: ['P10'] } };
      authService.logout.mockResolvedValue({ mensagem: 'Logout realizado com sucesso' });

      const result = await controller.logout(mockReq as any);

      expect(authService.logout).toHaveBeenCalledWith('user-uuid');
      expect(result).toHaveProperty('mensagem');
    });
  });
});
