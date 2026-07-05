import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { mockBackendInterceptor } from './mock-backend.interceptor';

describe('mockBackendInterceptor', () => {
  const API = 'http://localhost:3001/api/v1';

  function createRequest(url: string, method = 'GET', body?: any): HttpRequest<unknown> {
    return new HttpRequest<unknown>(method as any, url, body);
  }

  function pipeThrough(req: HttpRequest<unknown>) {
    const handler = () => of(new HttpResponse<unknown>({ body: 'passthrough' }));
    return mockBackendInterceptor(req, handler);
  }

  // ── Passthrough ───────────────────────────────────────
  it('should pass through non-API requests', (done) => {
    const req = createRequest('http://other-domain.com/data');
    let nextCalled = false;

    TestBed.runInInjectionContext(() => {
      mockBackendInterceptor(req, (r) => {
        nextCalled = true;
        return of(new HttpResponse<unknown>({ body: 'passthrough' }));
      }).subscribe(() => {
        expect(nextCalled).toBeTrue();
        done();
      });
    });
  });

  // ── Auth login ────────────────────────────────────────
  it('should handle POST /auth/login with valid mock user', (done) => {
    const body = { email: 'gestor.financas@mvp.local', senha: '123456' };
    const req = createRequest(`${API}/auth/login`, 'POST', body);

    TestBed.runInInjectionContext(() => {
      pipeThrough(req).subscribe((res: any) => {
        expect(res.body.access_token).toBeDefined();
        expect(res.body.refresh_token).toBeDefined();
        done();
      });
    });
  });

  // ── Auth profile ──────────────────────────────────────
  it('should handle GET /auth/profile', (done) => {
    localStorage.setItem('access_token', 'mock-at-mock-user-001');
    const req = createRequest(`${API}/auth/profile`, 'GET');

    TestBed.runInInjectionContext(() => {
      pipeThrough(req).subscribe((res: any) => {
        expect(res.body.nome).toBeDefined();
        expect(res.body.email).toBeDefined();
        done();
      });
    });
  });

  // ── Auth refresh ──────────────────────────────────────
  it('should handle POST /auth/refresh', (done) => {
    const body = { refresh_token: 'mock-rt-mock-user-001' };
    const req = createRequest(`${API}/auth/refresh`, 'POST', body);

    TestBed.runInInjectionContext(() => {
      pipeThrough(req).subscribe((res: any) => {
        expect(res.body.access_token).toBeDefined();
        expect(res.body.expires_in).toBe(1800);
        done();
      });
    });
  });

  // ── CRUD: list ────────────────────────────────────────
  it('should handle GET /auditorias (list)', (done) => {
    const req = createRequest(`${API}/auditorias`, 'GET');

    TestBed.runInInjectionContext(() => {
      pipeThrough(req).subscribe((res: any) => {
        expect(Array.isArray(res.body)).toBeTrue();
        done();
      });
    });
  });

  // ── CRUD: create ──────────────────────────────────────
  it('should handle POST /planos (create)', (done) => {
    const body = { titulo: 'Novo Plano', ano: 2026 };
    const req = createRequest(`${API}/planos`, 'POST', body);

    TestBed.runInInjectionContext(() => {
      pipeThrough(req).subscribe((res: any) => {
        expect(res.body.id).toBeDefined();
        done();
      });
    });
  });

  // ── CRUD: get single unknown ──────────────────────────
  it('should return 404 for non-existent entity', (done) => {
    const req = createRequest(`${API}/planos/non-existent-id`, 'GET');

    TestBed.runInInjectionContext(() => {
      pipeThrough(req).subscribe((res: any) => {
        expect(res.body.message).toBe('Not found');
        done();
      });
    });
  });

  // ── CRUD: delete unknown ──────────────────────────────
  it('should return not found on delete unknown id', (done) => {
    const req = createRequest(`${API}/planos/mock-id`, 'DELETE');

    TestBed.runInInjectionContext(() => {
      pipeThrough(req).subscribe((res: any) => {
        expect(res.body.message).toBe('Not found');
        done();
      });
    });
  });

  // ── Dashboards ────────────────────────────────────────
  it('should handle GET /dashboards/execucao', (done) => {
    const req = createRequest(`${API}/dashboards/execucao`, 'GET');

    TestBed.runInInjectionContext(() => {
      pipeThrough(req).subscribe((res: any) => {
        expect(res.body.total).toBeDefined();
        expect(res.body.porStatus).toBeDefined();
        done();
      });
    });
  });

  it('should handle GET /dashboards/recomendacoes', (done) => {
    const req = createRequest(`${API}/dashboards/recomendacoes`, 'GET');

    TestBed.runInInjectionContext(() => {
      pipeThrough(req).subscribe((res: any) => {
        expect(res.body.total).toBeDefined();
        done();
      });
    });
  });

  // ── Health ────────────────────────────────────────────
  it('should handle GET /dashboards/health', (done) => {
    const req = createRequest(`${API}/dashboards/health`, 'GET');

    TestBed.runInInjectionContext(() => {
      pipeThrough(req).subscribe((res: any) => {
        expect(res.body.status).toBe('ok');
        done();
      });
    });
  });

  // ── Unknown entity ────────────────────────────────────
  it('should return 404 for unknown entity', (done) => {
    const req = createRequest(`${API}/unknown-entity`, 'GET');

    TestBed.runInInjectionContext(() => {
      pipeThrough(req).subscribe((res: any) => {
        expect(res.body.message).toBe('Unknown entity');
        done();
      });
    });
  });

  // ── Method not allowed ────────────────────────────────
  it('should return 405 for unsupported method on entity', (done) => {
    const req = createRequest(`${API}/planos`, 'OPTIONS');

    TestBed.runInInjectionContext(() => {
      pipeThrough(req).subscribe((res: any) => {
        expect(res.body.message).toBe('Method not allowed');
        done();
      });
    });
  });
});
