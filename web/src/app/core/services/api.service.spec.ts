import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const API = 'http://localhost:3001/api/v1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ── Auditórias ────────────────────────────────────────
  it('should fetch auditorias list', async () => {
    const mockData = [{ id: '1', status: 'EM_EXECUCAO' }];
    const promise = service.getAuditorias({ status: 'EM_EXECUCAO' });

    const req = httpMock.expectOne(`${API}/auditorias?status=EM_EXECUCAO`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  // ── Planos ────────────────────────────────────────────
  it('should fetch planos list', async () => {
    const mockData = [{ id: 'p1', status: 'APROVADO' }];
    const promise = service.getPlanos();

    httpMock.expectOne(`${API}/planos`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  // ── Achados ───────────────────────────────────────────
  it('should fetch achados list', async () => {
    const mockData = [{ id: 'a1', status: 'CONSOLIDADO' }];
    const promise = service.getAchados();

    httpMock.expectOne(`${API}/achados`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  // ── Recomendações ─────────────────────────────────────
  it('should fetch recomendacoes list', async () => {
    const mockData = [{ id: 'r1', status: 'PENDENTE' }];
    const promise = service.getRecomendacoes();

    httpMock.expectOne(`${API}/recomendacoes`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  // ── Dashboards ────────────────────────────────────────
  it('should fetch dashboard execucao', async () => {
    const mockData = { total: 5, porStatus: { EM_EXECUCAO: 2, CONCLUIDA: 3 } };
    const promise = service.getDashboardExecucao({});

    httpMock.expectOne(`${API}/dashboards/execucao`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  it('should fetch dashboard recomendacoes', async () => {
    const mockData = { total: 10, vencidas: 3 };
    const promise = service.getDashboardRecomendacoes({});

    httpMock.expectOne(`${API}/dashboards/recomendacoes`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  it('should fetch dashboard PAA', async () => {
    const mockData = { totalPlanos: 2 };
    const promise = service.getDashboardPaa({});

    httpMock.expectOne(`${API}/dashboards/paa`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  it('should fetch dashboard qualidade', async () => {
    const mockData = { totalAvaliacoes: 4 };
    const promise = service.getDashboardQualidade({});

    httpMock.expectOne(`${API}/dashboards/qualidade`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  // ── Universo Auditável ────────────────────────────────
  it('should fetch universo list', async () => {
    const mockData = [{ id: 'u1', nome: 'Unidade A' }];
    const promise = service.getUniverso();

    httpMock.expectOne(`${API}/universo-auditavel`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  it('should get universo item by id', async () => {
    const mockData = { id: 'u1', nome: 'Unidade A' };
    const promise = service.getUniversoItem('u1');

    httpMock.expectOne(`${API}/universo-auditavel/u1`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  it('should create universo item', async () => {
    const body = { nome: 'Nova Unidade' };
    const response = { id: 'u2', ...body };
    const promise = service.criarUniversoItem(body);

    const req = httpMock.expectOne(`${API}/universo-auditavel`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(response);

    const result = await promise;
    expect(result.id).toBe('u2');
  });

  it('should update universo item', async () => {
    const body = { nome: 'Nome atualizado' };
    const response = { id: 'u1', ...body };
    const promise = service.atualizarUniversoItem('u1', body);

    const req = httpMock.expectOne(`${API}/universo-auditavel/u1`);
    expect(req.request.method).toBe('PATCH');
    req.flush(response);

    const result = await promise;
    expect(result.id).toBe('u1');
  });

  it('should remove universo item', async () => {
    const promise = service.removerUniversoItem('u1');

    const req = httpMock.expectOne(`${API}/universo-auditavel/u1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Deleted' });

    await promise;
  });

  // ── Integrações ───────────────────────────────────────
  it('should fetch integracoes list', async () => {
    const mockData = [{ id: 'i1', nome: 'SIAUD-Jud' }];
    const promise = service.getIntegracoes();

    httpMock.expectOne(`${API}/integracoes`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  it('should create integracao', async () => {
    const body = { nome: 'Nova Integração' };
    const response = { id: 'i2', ...body };
    const promise = service.criarIntegracao(body);

    const req = httpMock.expectOne(`${API}/integracoes`);
    expect(req.request.method).toBe('POST');
    req.flush(response);

    const result = await promise;
    expect(result.id).toBe('i2');
  });

  it('should health check integracao', async () => {
    const promise = service.healthCheckIntegracao('i1');

    const req = httpMock.expectOne(`${API}/integracoes/i1/health`);
    expect(req.request.method).toBe('POST');
    req.flush({ status: 'ok' });

    await promise;
  });

  // ── Ações Coordenadas ────────────────────────────────
  it('should fetch acoes coordenadas list', async () => {
    const mockData = [{ id: 'ac1' }];
    const promise = service.getAcoesCoordenadas();

    httpMock.expectOne(`${API}/acoes-coordenadas`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  it('should reportar resultado CPA', async () => {
    const promise = service.reportarResultadoCPA('ac1', { auditoriaId: 'aud1' });

    const req = httpMock.expectOne(`${API}/acoes-coordenadas/ac1/reportar`);
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });

    await promise;
  });

  // ── Qualidade/PQAUD ───────────────────────────────────
  it('should fetch qualidade avaliacoes', async () => {
    const mockData = [{ id: 'q1', status: 'CONCLUIDA' }];
    const promise = service.getAvaliacoesQualidade();

    httpMock.expectOne(`${API}/qualidade/avaliacoes`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  it('should get nao conformidades with avaliacaoId filter', async () => {
    const mockData = [{ id: 'nc1' }];
    const promise = service.getNaoConformidades('av1');

    httpMock.expectOne(`${API}/qualidade/nao-conformidades?avaliacaoId=av1`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  it('should export dashboard as blob', async () => {
    const promise = service.exportarDashboard('paa', 'PDF');

    const req = httpMock.expectOne(`${API}/dashboards/export/paa?formato=PDF`);
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob());

    await promise;
  });

  // ── Governança ────────────────────────────────────────
  it('should fetch determinacoes externas', async () => {
    const mockData = [{ id: 'd1', orgao: 'TCU' }];
    const promise = service.getDeterminacoesExternas();

    httpMock.expectOne(`${API}/determinacoes-externas`).flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  it('should comunicar fraude', async () => {
    const promise = service.comunicarFraude('rf1', 'MPT');

    const req = httpMock.expectOne(`${API}/registros-fraude/rf1/comunicar`);
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });

    await promise;
  });
});
