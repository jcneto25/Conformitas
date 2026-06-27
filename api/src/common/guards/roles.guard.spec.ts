import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  function mockContext(roles: string[], user: any = { sub: 'user-1', roles: ['P01'] }): ExecutionContext {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(roles);
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
  }

  describe('canActivate', () => {
    it('deve permitir acesso quando usuário tem a role requerida', () => {
      const ctx = mockContext(['P01'], { sub: 'user-1', roles: ['P01', 'P10'] });
      expect(guard.canActivate(ctx)).toBe(true);
    });

    it('deve negar acesso quando usuário não tem a role requerida', () => {
      const ctx = mockContext(['P01'], { sub: 'user-2', roles: ['P02'] });
      expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    });

    it('deve negar acesso quando usuário não autenticado', () => {
      const ctx = mockContext(['P01'], null);
      expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    });

    it('deve permitir acesso quando múltiplas roles aceitas e usuário tem uma delas', () => {
      const ctx = mockContext(['P01', 'P03', 'P04', 'P10'], { sub: 'user-3', roles: ['P03'] });
      expect(guard.canActivate(ctx)).toBe(true);
    });

    it('deve negar acesso quando múltiplas roles aceitas mas usuário não tem nenhuma', () => {
      const ctx = mockContext(['P01', 'P10'], { sub: 'user-4', roles: ['P05'] });
      expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    });

    it('deve permitir acesso quando sem roles requeridas (endpoint público)', () => {
      const ctx = mockContext([], { sub: 'user-1' });
      expect(guard.canActivate(ctx)).toBe(true);
    });
  });
});
