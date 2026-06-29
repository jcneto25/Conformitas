import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from './auth.service';

const API = 'http://localhost:3001/api/v1';

function makeFakeProfile(overrides?: Partial<UserProfile>): UserProfile {
  return {
    id: 'user-1',
    nome: 'Rômulo Pinheiro Ribeiro',
    email: 'romulo.ribeiro@mvp.local',
    matricula: 'AUD001',
    cargo: 'Auditor-Chefe',
    unidade: 'AUDIN',
    ativo: true,
    mfaEnabled: true,
    usuariosPerfis: [{ perfil: { codigo: 'P01', nome: 'Auditor-Chefe', permissoes: {} } }],
    ...overrides,
  };
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    localStorage.clear();
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start unauthenticated with no stored token', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.user()).toBeNull();
    expect(service.userRoles()).toEqual([]);
  });

  describe('login', () => {
    it('should set session on login without MFA', async () => {
      service.login('test@test.com', 'password');

      const req = httpMock.expectOne(`${API}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush({ access_token: 'at1', refresh_token: 'rt1', expires_in: 1800 });

      await new Promise(r => setTimeout(r));

      expect(localStorage.getItem('access_token')).toBe('at1');
      expect(localStorage.getItem('refresh_token')).toBe('rt1');

      const profileReq = httpMock.expectOne(`${API}/auth/profile`);
      profileReq.flush(makeFakeProfile({ mfaEnabled: false }));

      await new Promise(r => setTimeout(r));
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.user()?.nome).toBe('Rômulo Pinheiro Ribeiro');
      expect(service.userRoles()).toEqual(['P01']);
    });

    it('should return mfa_required when MFA is enabled', async () => {
      const loginPromise = service.login('test@test.com', 'password');

      const req = httpMock.expectOne(`${API}/auth/login`);
      req.flush({ mfa_required: true, session_token: 'st1' });

      const result = await loginPromise;

      expect(result.mfa_required).toBeTrue();
      expect(result.session_token).toBe('st1');
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('verifyMfa', () => {
    it('should set session after MFA verification', async () => {
      service.verifyMfa('st1', '123456');

      const req = httpMock.expectOne(`${API}/auth/mfa/verify`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ session_token: 'st1', totp_code: '123456' });
      req.flush({ access_token: 'at2', refresh_token: 'rt2', expires_in: 1800 });

      await new Promise(r => setTimeout(r));

      expect(localStorage.getItem('access_token')).toBe('at2');
      expect(localStorage.getItem('refresh_token')).toBe('rt2');

      const profileReq = httpMock.expectOne(`${API}/auth/profile`);
      profileReq.flush(makeFakeProfile());

      await new Promise(r => setTimeout(r));
      expect(service.isAuthenticated()).toBeTrue();
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      localStorage.setItem('refresh_token', 'rt-old');

      const refreshPromise = service.refresh();

      const req = httpMock.expectOne(`${API}/auth/refresh`);
      expect(req.request.body).toEqual({ refresh_token: 'rt-old' });
      req.flush({ access_token: 'at-new', refresh_token: 'rt-new', expires_in: 1800 });

      await refreshPromise;

      expect(localStorage.getItem('access_token')).toBe('at-new');
      expect(localStorage.getItem('refresh_token')).toBe('rt-new');
    });

    it('should throw when no refresh token', async () => {
      localStorage.removeItem('refresh_token');
      await expectAsync(service.refresh()).toBeRejectedWithError('No refresh token');
    });
  });

  describe('tryRefresh', () => {
    it('should return true on success', async () => {
      localStorage.setItem('refresh_token', 'rt');
      const resultPromise = service.tryRefresh();

      httpMock.expectOne(`${API}/auth/refresh`).flush({ access_token: 'a', refresh_token: 'r', expires_in: 1800 });

      expect(await resultPromise).toBeTrue();
    });

    it('should return false on failure', async () => {
      localStorage.setItem('refresh_token', 'rt-invalid');
      const resultPromise = service.tryRefresh();

      httpMock.expectOne(`${API}/auth/refresh`).flush(null, { status: 401, statusText: 'Unauthorized' });

      expect(await resultPromise).toBeFalse();
    });
  });

  describe('loadProfile', () => {
    it('should update user and roles signals', async () => {
      service['isAuthenticated'].set(true);
      const loadPromise = service.loadProfile();

      const req = httpMock.expectOne(`${API}/auth/profile`);
      req.flush(makeFakeProfile({ nome: 'Carlos Melo', usuariosPerfis: [{ perfil: { codigo: 'P02', nome: 'Auditor', permissoes: {} } }] }));

      await loadPromise;

      expect(service.user()?.nome).toBe('Carlos Melo');
      expect(service.userRoles()).toEqual(['P02']);
    });

    it('should clear session on 401', async () => {
      localStorage.setItem('access_token', 'old');
      service['isAuthenticated'].set(true);
      const loadPromise = service.loadProfile();

      httpMock.expectOne(`${API}/auth/profile`).flush(null, { status: 401, statusText: 'Unauthorized' });

      await loadPromise;

      expect(service.isAuthenticated()).toBeFalse();
      expect(service.user()).toBeNull();
      expect(localStorage.getItem('access_token')).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear session and navigate to login', () => {
      localStorage.setItem('access_token', 'at');
      localStorage.setItem('refresh_token', 'rt');
      service['isAuthenticated'].set(true);

      service.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(service.isAuthenticated()).toBeFalse();
      expect(service.user()).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('hasRole / hasAnyRole', () => {
    beforeEach(() => {
      service.userRoles.set(['P01', 'P10']);
    });

    it('hasRole should return true for matching role', () => {
      expect(service.hasRole('P01')).toBeTrue();
      expect(service.hasRole('P02')).toBeFalse();
    });

    it('hasAnyRole should return true if any matches', () => {
      expect(service.hasAnyRole(['P02', 'P10'])).toBeTrue();
      expect(service.hasAnyRole(['P02', 'P03'])).toBeFalse();
    });
  });
});
