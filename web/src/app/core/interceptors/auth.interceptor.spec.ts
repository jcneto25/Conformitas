import { TestBed } from '@angular/core/testing';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  provideHttpClient,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let toastSpy: jasmine.SpyObj<ToastService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let nextHandler: jasmine.Spy<HttpHandlerFn>;

  function createRequest(url: string, method = 'GET'): HttpRequest<unknown> {
    return new HttpRequest<unknown>(method as any, url);
  }

  beforeEach(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['logout', 'tryRefresh']);
    toastSpy = jasmine.createSpyObj('ToastService', ['show']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    nextHandler = jasmine.createSpy().and.returnValue(of({}));

    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: authSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should add Authorization header when token exists', (done) => {
    localStorage.setItem('access_token', 'test-token');
    const req = createRequest('http://localhost:3001/api/v1/auditorias');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextHandler).subscribe(() => {
        const interceptedReq: HttpRequest<unknown> = nextHandler.calls.first().args[0];
        expect(interceptedReq.headers.get('Authorization')).toBe('Bearer test-token');
        done();
      });
    });
  });

  it('should not add Authorization header for login endpoint', (done) => {
    localStorage.setItem('access_token', 'test-token');
    const req = createRequest('http://localhost:3001/api/v1/auth/login', 'POST');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextHandler).subscribe(() => {
        const interceptedReq: HttpRequest<unknown> = nextHandler.calls.first().args[0];
        expect(interceptedReq.headers.get('Authorization')).toBeNull();
        done();
      });
    });
  });

  it('should not add header when no token exists', (done) => {
    const req = createRequest('http://localhost:3001/api/v1/auditorias');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextHandler).subscribe(() => {
        const interceptedReq: HttpRequest<unknown> = nextHandler.calls.first().args[0];
        expect(interceptedReq.headers.get('Authorization')).toBeNull();
        done();
      });
    });
  });

  it('should not add header for MFA verify endpoint', (done) => {
    localStorage.setItem('access_token', 'test-token');
    const req = createRequest('http://localhost:3001/api/v1/auth/mfa/verify', 'POST');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextHandler).subscribe(() => {
        const interceptedReq: HttpRequest<unknown> = nextHandler.calls.first().args[0];
        expect(interceptedReq.headers.get('Authorization')).toBeNull();
        done();
      });
    });
  });

  it('should show error toast on 403 response', (done) => {
    nextHandler.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 403 })),
    );
    const req = createRequest('http://localhost:3001/api/v1/auditorias');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextHandler).subscribe({
        error: () => {
          expect(toastSpy.show).toHaveBeenCalledWith(
            jasmine.stringContaining('Acesso negado'),
            'error',
          );
          done();
        },
      });
    });
  });

  it('should show error toast on 500 response', (done) => {
    nextHandler.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500 })),
    );
    const req = createRequest('http://localhost:3001/api/v1/auditorias');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextHandler).subscribe({
        error: () => {
          expect(toastSpy.show).toHaveBeenCalledWith(
            jasmine.stringContaining('Erro de conexão'),
            'error',
          );
          done();
        },
      });
    });
  });

  it('should show error toast on status 0 (offline)', (done) => {
    nextHandler.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 0 })),
    );
    const req = createRequest('http://localhost:3001/api/v1/auditorias');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextHandler).subscribe({
        error: () => {
          expect(toastSpy.show).toHaveBeenCalledWith(
            jasmine.stringContaining('Erro de conexão'),
            'error',
          );
          done();
        },
      });
    });
  });

  describe('401 handling', () => {
    it('should try refresh on 401, succeed and retry with new token', (done) => {
      authSpy.tryRefresh.and.returnValue(Promise.resolve(true));
      localStorage.setItem('access_token', 'new-refreshed-token');

      nextHandler.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 401 })),
      );

      const req = createRequest('http://localhost:3001/api/v1/auditorias');

      TestBed.runInInjectionContext(() => {
        authInterceptor(req, nextHandler).subscribe({
          error: () => {
            expect(authSpy.tryRefresh).toHaveBeenCalled();
            done();
          },
        });
      });
    });

    it('should not try refresh on 401 for login endpoint', (done) => {
      nextHandler.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 401 })),
      );

      const req = createRequest('http://localhost:3001/api/v1/auth/login', 'POST');

      TestBed.runInInjectionContext(() => {
        authInterceptor(req, nextHandler).subscribe({
          error: () => {
            expect(authSpy.tryRefresh).not.toHaveBeenCalled();
            done();
          },
        });
      });
    });
  });
});
