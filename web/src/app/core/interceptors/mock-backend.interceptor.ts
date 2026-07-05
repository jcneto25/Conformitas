import { HttpInterceptorFn, HttpResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import usersData from '../../../../../mocks/data/users.json';
import universoData from '../../../../../mocks/data/universo_auditavel.json';
import planosData from '../../../../../mocks/data/planos_auditoria.json';
import auditoriasData from '../../../../../mocks/data/auditorias_execucao.json';
import achadosData from '../../../../../mocks/data/achados_relatorios_recomendacoes.json';
import eticaData from '../../../../../mocks/data/etica_sigilo.json';
import consultoriasData from '../../../../../mocks/data/consultorias_qualidade_riscos.json';
import configData from '../../../../../mocks/data/perfis_configuracoes.json';
import mandatosData from '../../../../../mocks/data/mandatos.json';
import itensPlanoData from '../../../../../mocks/data/itens_plano.json';
import forcaTrabalhoData from '../../../../../mocks/data/forca_trabalho.json';
import acoesCoordenadasData from '../../../../../mocks/data/acoes_coordenadas.json';
import integracoesData from '../../../../../mocks/data/integracoes.json';
import governancaFraudesData from '../../../../../mocks/data/governanca_fraudes.json';
import competenciasData from '../../../../../mocks/data/competencias.json';
import documentosMetodologicosData from '../../../../../mocks/data/documentos_metodologicos.json';

const API = 'http://localhost:3001/api/v1';
const users: any[] = (usersData as any).users;

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== 'object') return obj;
  const camel: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    camel[key] = snakeToCamel(v);
  }
  return camel;
}

interface EntityStore { data: any[]; idKey: string }

const stores: Record<string, EntityStore> = {};

function register(key: string, data: any) {
  if (Array.isArray(data)) {
    stores[key] = { data: snakeToCamel(data), idKey: 'id' };
  } else if (data && typeof data === 'object') {
    for (const [k, v] of Object.entries(data)) {
      if (Array.isArray(v)) {
        stores[k] = { data: snakeToCamel(v), idKey: 'id' };
      }
    }
  }
}

register('universo_auditavel', universoData);
register('planos_auditoria', planosData);
register('auditorias', auditoriasData);
register('evidencias', auditoriasData);
register('papeis_trabalho', auditoriasData);
register('requisicoes', auditoriasData);
register('achados', achadosData);
register('manifestacoes', achadosData);
register('recomendacoes', achadosData);
register('providencias', achadosData);
register('relatorios', achadosData);
register('declaracoes_independencia', eticaData);
register('impedimentos', eticaData);
register('consultorias', consultoriasData);
register('capacitacoes', consultoriasData);
register('riscos', consultoriasData);
register('avaliacoes_qualidade', consultoriasData);
register('nao_conformidades', consultoriasData);
register('perfis', configData);
register('configuracoes_sistema', configData);
register('mandatos', mandatosData);
register('itens_plano', itensPlanoData);
register('forca_trabalho', forcaTrabalhoData);
register('acoes_coordenadas', acoesCoordenadasData);
register('integracoes', integracoesData);
register('determinacoes_externas', governancaFraudesData);
register('registros_fraude', governancaFraudesData);
register('competencias', competenciasData);
register('documentos_metodologicos', documentosMetodologicosData);
register('users', users);
// Fix: configurações uses 'chave' as PK, not 'id'
if (stores['configuracoes']) stores['configuracoes'].idKey = 'chave';
// Junction table for profiles
const usuariosPerfisData: any[] = [];
stores['usuarios_perfis'] = { data: usuariosPerfisData, idKey: 'id' };
// Relatórios anuais — seeded with initial mock data
stores['relatorios_anuais'] = {
  data: [
    { id: 'ra-001', ano: 2025, status: 'GERADO', conteudo: 'Relatório Anual de Atividades — Exercício 2025\n\nAuditorias: 3\nRecomendações: 8\nConsultorias: 1', autorId: 'mock-user-001', dataGeracao: '2026-01-15T10:00:00Z' },
    { id: 'ra-002', ano: 2026, status: 'RASCUNHO', conteudo: '', autorId: 'mock-user-001', dataGeracao: null },
  ],
  idKey: 'id',
};

const ENTITY_ROUTES: [string, string][] = [
  ['universo', 'universo_auditavel'],
  ['universo-auditavel', 'universo_auditavel'],
  ['planos', 'planos_auditoria'],
  ['auditorias', 'auditorias'],
  ['evidencias', 'evidencias'],
  ['papeis-trabalho', 'papeis_trabalho'],
  ['requisicoes', 'requisicoes'],
  ['achados', 'achados_auditoria'],
  ['manifestacoes', 'manifestacoes'],
  ['recomendacoes', 'recomendacoes'],
  ['providencias', 'providencias'],
  ['relatorios', 'relatorios_auditoria'],
  ['declaracoes', 'declaracoes_independencia'],
  ['impedimentos', 'impedimentos'],
  ['consultorias', 'consultorias'],
  ['capacitacoes', 'capacitacoes'],
  ['riscos', 'riscos'],
  ['avaliacoes-qualidade', 'avaliacoes_qualidade'],
  ['nao-conformidades', 'nao_conformidades'],
  ['itens-plano', 'itens_plano'],
  ['forca-trabalho', 'forca_trabalho'],
  ['perfis', 'perfis'],
  ['configuracoes', 'configuracoes'],
  ['dashboards', 'auditorias'],
  ['determinacoes-externas', 'determinacoes_externas'],
  ['registros-fraude', 'registros_fraude'],
  ['usuarios', 'users'],
  ['usuarios-perfis', 'usuarios_perfis'],
  ['mandatos', 'mandatos'],
  ['acoes-coordenadas', 'acoes_coordenadas'],
  ['integracoes', 'integracoes'],
  ['etica', 'classificacoes_documento'],
  ['relatorios-anuais', 'relatorios_anuais'],
  ['competencias', 'competencias'],
  ['documentos-metodologicos', 'documentos_metodologicos'],
];

const ENTITY_MAP = new Map(ENTITY_ROUTES);

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const mockBackendInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<any> => {
  if (!isDev) return next(req);
  const { url, method } = req;
  if (!url.startsWith(API)) return next(req);

  const path = url.replace(API, '').replace(/\/+$/, '').split('?')[0];
  const segments = path.split('/').filter(Boolean);

  if (url.includes('/auth/')) return handleAuth(req, segments);
  const entityPath = segments[0];
  if (entityPath === 'dashboards') return handleDashboards(req, segments);
  return handleCrud(req, segments);
};

function json(body: unknown, status = 200): Observable<HttpResponse<unknown>> {
  return of(new HttpResponse({ status, body }));
}

function handleAuth(req: HttpRequest<unknown>, segments: string[]): Observable<HttpResponse<unknown>> {
  const action = segments[1];

  if (req.method === 'POST' && action === 'login') {
    const body = req.body as any;
    const user = users.find((u) => u.email === body?.email && u.senha === body?.senha);
    if (user?.ativo === false) return json({ message: 'Usuário inativo' }, 401);
    if (!user) return json({ message: 'Credenciais inválidas' }, 401);
    if (user.mfaEnabled) {
      return json({ mfa_required: true, session_token: `mock-session-${user.id}` });
    }
    return json({
      access_token: `mock-at-${user.id}`,
      refresh_token: `mock-rt-${user.id}`,
      expires_in: 1800,
    });
  }

  if (req.method === 'POST' && action === 'mfa' && segments[2] === 'verify') {
    const body = req.body as any;
    const sessionToken = body?.session_token || '';
    const userId = sessionToken.replace('mock-session-', '');
    const user = users.find((u) => u.id === userId) || users[0];
    return json({
      access_token: `mock-at-${user.id}`,
      refresh_token: `mock-rt-${user.id}`,
      expires_in: 1800,
    });
  }

  if (req.method === 'POST' && action === 'refresh') {
    const body = req.body as any;
    const refreshToken = body?.refresh_token || '';
    const userId = refreshToken.replace('mock-rt-', '').replace('-refreshed', '');
    const user = users.find((u) => u.id === userId) || users[0];
    return json({
      access_token: `mock-at-${user.id}-refreshed`,
      refresh_token: `mock-rt-${user.id}-refreshed`,
      expires_in: 1800,
    });
  }

  if (req.method === 'POST' && action === 'logout') {
    return json({ message: 'Logout realizado' });
  }

  if (req.method === 'GET' && action === 'profile') {
    const token = localStorage.getItem('access_token') || '';
    const userId = token.replace('mock-at-', '').replace('-refreshed', '');
    const user = users.find((u) => u.id === userId) || users[0];
    return json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      matricula: user.matricula,
      cargo: user.cargo,
      unidade: user.unidade,
      ativo: user.ativo,
      mfaEnabled: user.mfaEnabled,
      usuariosPerfis: [{ perfil: { codigo: user.perfil, nome: user.perfilNome, permissoes: {} } }],
    });
  }

  return json({ message: 'Not found' }, 404);
}

function handleDashboards(req: HttpRequest<unknown>, segments: string[]): Observable<HttpResponse<unknown>> {
  const tipo = segments[1]; // 'paa', 'execucao', 'recomendacoes', 'qualidade', 'export', 'health'
  const metodo = req.method;

  const planosStore = stores['planos_auditoria'];
  const auditoriasStore = stores['auditorias'];
  const recomendacoesStore = stores['recomendacoes'];
  const qualidadeStore = stores['avaliacoes_qualidade'];
  const ncStore = stores['nao_conformidades'];

  // Health
  if (tipo === 'health' && metodo === 'GET') {
    return json({ status: 'ok', pdfDisponivel: true, xlsxDisponivel: true, timestamp: new Date().toISOString() });
  }

  // Export: /dashboards/export/:tipo
  if (tipo === 'export' && metodo === 'POST') {
    const exportTipo = segments[2] || 'paa';
    const dados = aggregateDashboard(exportTipo);
    return json({ tipo: exportTipo, formato: 'PDF', geradoEm: new Date().toISOString(), dados });
  }

  if (metodo !== 'GET') return json({ message: 'Method not allowed' }, 405);

  const data = aggregateDashboard(tipo);
  return json(data);

  function aggregateDashboard(t: string): any {
    switch (t) {
      case 'paa': {
        const planos = planosStore?.data || [];
        const planosAprovados = planos.filter((p: any) => p.status === 'APROVADO' || p.status === 'PUBLICADO').length;
        const horasDisp = planos.reduce((s: number, p: any) => s + ((p.forcaTrabalho || []).reduce((a: number, f: any) => a + (f.horasDisponiveisAno || 0), 0)), 0);
        const horasAloc = planos.reduce((s: number, p: any) => s + ((p.forcaTrabalho || []).reduce((a: number, f: any) => a + (f.horasAlocadasAuditoria || 0), 0)), 0);
        const auditorias = auditoriasStore?.data || [];
        const auditoriasConcluidas = auditorias.filter((a: any) => a.status === 'CONCLUIDA').length;
        return {
          totalPlanos: planos.length,
          planosAprovados,
          totalHorasDisponiveis: horasDisp,
          totalHorasAlocadas: horasAloc,
          auditoriasConcluidas,
          planejamentoPercentual: horasDisp > 0 ? Math.round((horasAloc / horasDisp) * 100) : 0,
        };
      }
      case 'execucao': {
        const auditorias = auditoriasStore?.data || [];
        const total = auditorias.length;
        const porStatus: Record<string, number> = {};
        const porTipo: Record<string, number> = {};
        const porUnidade: Record<string, number> = {};
        for (const a of auditorias) {
          porStatus[a.status] = (porStatus[a.status] ?? 0) + 1;
          porTipo[a.tipo] = (porTipo[a.tipo] ?? 0) + 1;
          if (a.unidadeAuditada) porUnidade[a.unidadeAuditada] = (porUnidade[a.unidadeAuditada] ?? 0) + 1;
        }
        return { total, porStatus, porTipo, porUnidade };
      }
      case 'recomendacoes': {
        const recs = recomendacoesStore?.data || [];
        const total = recs.length;
        const porStatus: Record<string, number> = {};
        const porCriticidade: Record<string, number> = {};
        let vencidas = 0;
        const agora = new Date();
        for (const r of recs) {
          porStatus[r.status] = (porStatus[r.status] ?? 0) + 1;
          porCriticidade[r.criticidade] = (porCriticidade[r.criticidade] ?? 0) + 1;
          if (r.status !== 'CUMPRIDA' && r.prazo && new Date(r.prazo) < agora) vencidas++;
        }
        return { total, porStatus, porCriticidade, vencidas, noPrazo: total - vencidas };
      }
      case 'qualidade': {
        const avals = qualidadeStore?.data || [];
        const ncs = ncStore?.data || [];
        const concluidas = avals.filter((a: any) => a.status === 'CONCLUIDA');
        const notasValidas = concluidas.filter((a: any) => a.nota != null);
        const mediaNota = notasValidas.length > 0
          ? Math.round((notasValidas.reduce((acc: number, a: any) => acc + a.nota, 0) / notasValidas.length) * 100) / 100
          : null;
        const totalNc = avals.reduce((acc: number, a: any) => acc + (a.naoConformidades?.length || 0), 0);
        const ncAbertas = ncs.filter((nc: any) => nc.status !== 'CORRIGIDA').length;
        return {
          totalAvaliacoes: avals.length,
          avaliacoesConcluidas: concluidas.length,
          mediaNota,
          totalNaoConformidades: Math.max(totalNc, ncAbertas),
          naoConformidadesAbertas: ncAbertas,
          indicadores: [
            { id: 'ind-001', nome: 'Eficácia das Recomendações', valor: '75%', meta: '80%' },
            { id: 'ind-002', nome: 'Tempestividade das Auditorias', valor: '85%', meta: '90%' },
            { id: 'ind-003', nome: 'Cobertura do PAA', valor: '92%', meta: '90%' },
          ],
        };
      }
      default:
        return { total: 0 };
    }
  }
}

function handleCrud(req: HttpRequest<unknown>, segments: Array<string>): Observable<HttpResponse<unknown>> {
  const entityPath = segments[0];
  const entityKey = ENTITY_MAP.get(entityPath);
  if (!entityKey) return json({ message: 'Unknown entity' }, 404);

  const store = stores[entityKey];
  if (!store) return json({ message: 'No store' }, 404);

  const id = segments[1];
  const subPath = segments[2];

  const subEntityKey = subPath ? ENTITY_MAP.get(subPath) : null;
  const subStore = subEntityKey ? stores[subEntityKey] : null;

  // Special: GET /universo-auditavel/matriz-priorizacao
  if (entityKey === 'universo_auditavel' && segments[1] === 'matriz-priorizacao' && req.method === 'GET') {
    const urlObj = new URL(req.url);
    const horasParam = urlObj.searchParams.get('horas_disponiveis') || req.params.get('horas_disponiveis') || null;
    const universe = store.data;
    const itens = universe.map((u: any) => {
      const m = u.materialidade ?? Math.floor(Math.random() * 10) + 1;
      const r = u.relevancia ?? Math.floor(Math.random() * 10) + 1;
      const c = u.criticidade ?? Math.floor(Math.random() * 10) + 1;
      const riscoVal = u.risco ?? Math.floor(Math.random() * 10) + 1;
      const indice = u.indicePriorizacao ?? Math.round(Math.pow(m * r * c * (riscoVal || 1), 1 / 4) * 100) / 100;
      return { ...u, materialidade: m, relevancia: r, criticidade: c, risco: riscoVal, indicePriorizacao: indice };
    });
    itens.sort((a: any, b: any) => b.indicePriorizacao - a.indicePriorizacao);
    let destaques: string[] = [];
    if (horasParam) {
      let horasRest = parseInt(horasParam, 10);
      for (const item of itens) {
        if (horasRest <= 0) break;
        destaques.push(item.id);
        horasRest -= 100;
      }
    }
    return json({ itens, destaques });
  }

  // PRP-012: GET /riscos/matriz — matriz de riscos agrupada por nível
  if (entityPath === 'riscos' && segments[1] === 'matriz' && req.method === 'GET') {
    const levels = ['BAIXO', 'MEDIO', 'ALTO', 'CRITICO', 'EXTREMO'];
    const matriz = levels.map((nivel) => {
      const riscos = store.data.filter((r: any) => r.nivel === nivel);
      const scores = riscos.map((r: any) => (r.probabilidade || 1) * (r.impacto || 1));
      const scoreMedio = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
      return {
        nivel,
        quantidade: riscos.length,
        scoreMedio,
        riscos: riscos.map((r: any) => ({ id: r.id, codigo: r.codigo, descricao: r.descricao })),
      };
    });
    return json(matriz.filter((m) => m.quantidade > 0));
  }

  // PRP-012: GET /capacitacoes/totalizacao — total de horas por participante/ano
  if (entityPath === 'capacitacoes' && segments[1] === 'totalizacao' && req.method === 'GET') {
    const totalHoras = store.data.reduce((sum: number, c: any) => sum + (c.cargaHoraria || 0), 0);
    return json({ totalHoras });
  }

  // PRP-012: GET /capacitacoes/alerta-meta — alerta de meta 40h
  if (entityPath === 'capacitacoes' && segments[1] === 'alerta-meta' && req.method === 'GET') {
    const totalHoras = store.data.reduce((sum: number, c: any) => sum + (c.cargaHoraria || 0), 0);
    const meta = 40;
    const faltam = Math.max(0, meta - totalHoras);
    return json({ totalHoras, meta, faltam, dentroDaMeta: faltam <= 0 });
  }

  // Special: /etica/{entidadeTipo}/{entidadeId}/classificacao
  if (entityPath === 'etica' && segments[3] === 'classificacao') {
    const entidadeTipo = segments[1];
    const entidadeId = segments[2];
    const existing = store.data.find((c: any) => c.entidadeTipo === entidadeTipo && c.entidadeId === entidadeId);
    if (req.method === 'GET') {
      return json(existing || null);
    }
    if (req.method === 'PUT' || req.method === 'POST') {
      const body = req.body as any;
      if (existing) {
        Object.assign(existing, { nivelSigilo: body.nivelSigilo, justificativa: body.justificativa, classificadoPor: body.classificadoPor || 'mock-user-001' });
        return json(existing);
      }
      const nova = { id: `cls-mock-${Date.now()}`, entidadeTipo, entidadeId, nivelSigilo: body.nivelSigilo, justificativa: body.justificativa || '', classificadoPor: body.classificadoPor || 'mock-user-001' };
      store.data.push(nova);
      return json(nova, 201);
    }
  }

  // Special: GET /usuarios/:id/perfis (junction table)
  if (entityPath === 'usuarios' && id && subPath === 'perfis' && req.method === 'GET') {
    const perfisKey = ENTITY_MAP.get('perfis');
    const perfisStore = perfisKey ? stores[perfisKey] : null;
    const upStore = stores['usuarios_perfis'];
    if (!upStore || !perfisStore) return json([]);
    const ups = upStore.data.filter((up: any) => up.usuarioId === id);
    return json(ups.map((up: any) => ({
      ...up,
      perfil: perfisStore.data.find((p: any) => p.id === up.perfilId) || null,
    })));
  }

  // Sub-path GET: /entidade/:id/subentidade
  if (id && subStore && req.method === 'GET') {
    const filtered = subStore.data.filter((r: any) =>
      r.auditoriaId === id || r.achadoId === id || r.recomendacaoId === id,
    );
    return json(filtered);
  }

  // Special: POST /usuarios/:id/perfis (junction table)
  if (entityPath === 'usuarios' && id && subPath === 'perfis' && req.method === 'POST') {
    const body = req.body as any;
    const perfilId = body.perfil_id || body.perfilId;
    if (!perfilId) return json({ message: 'perfil_id required' }, 400);
    const upStore = stores['usuarios_perfis'];
    const nova = { id: `up-mock-${Date.now()}`, usuarioId: id, perfilId, unidadeEscopo: body.unidade_escopo || body.unidadeEscopo || '' };
    upStore.data.push(nova);
    return json(nova, 201);
  }

  // Sub-path POST: /entidade/:id/providencias, /entidade/:id/enviar-manifestacao, etc
  if (id && subPath && req.method === 'POST') {
    if (subPath === 'providencias' && req.body) {
      const body = req.body as any;
      const nova = { id: `mock-${Date.now()}`, ...body, data: new Date().toISOString() };
      if (subStore) subStore.data.push(nova);
      return json(nova, 201);
    }
    if (subPath === 'validar') {
      const item = store.data.find((r: any) => r[store.idKey] === id);
      if (item) item.status = 'CUMPRIDA';
      return json({ message: 'Recomendação validada', success: true });
    }
    if (subPath === 'enviar-manifestacao') {
      const item = store.data.find((r: any) => r[store.idKey] === id);
      if (item) item.status = 'EM_MANIFESTACAO';
      return json({ message: 'Enviado para manifestação', success: true });
    }
    if (subPath === 'consolidar') {
      const item = store.data.find((r: any) => r[store.idKey] === id);
      if (item) item.status = 'CONSOLIDADO';
      return json({ message: 'Achado consolidado', success: true });
    }
    if (subPath === 'assinar' && subStore) {
      const item = subStore.data.find((r: any) => r[store.idKey] === id);
      if (item) item.status = 'ASSINADO';
      return json({ message: 'Relatório assinado', success: true });
    }
    if (subPath === 'submeter') {
      const item = store.data.find((r: any) => r[store.idKey] === id);
      if (item) item.status = 'SUBMETIDO';
      return json({ message: 'Plano submetido', success: true });
    }
    if (subPath === 'aprovar') {
      const item = store.data.find((r: any) => r[store.idKey] === id);
      if (item) item.status = 'APROVADO';
      return json({ message: 'Plano aprovado', success: true });
    }
    if (subPath === 'devolver') {
      const item = store.data.find((r: any) => r[store.idKey] === id);
      if (item) item.status = 'RASCUNHO';
      return json({ message: 'Plano devolvido', success: true });
    }
    if (subPath === 'publicar') {
      const item = store.data.find((r: any) => r[store.idKey] === id);
      if (item) item.status = 'PUBLICADO';
      return json({ message: 'Plano publicado', success: true });
    }
    if (subPath === 'relatorios' && entityPath === 'auditorias' && subStore) {
      const body = req.body as any;
      const novo = { id: `mock-${Date.now()}`, auditoriaId: id, tipo: body?.tipo || 'PRELIMINAR', status: 'RASCUNHO', conteudo: 'Relatório gerado automaticamente (mock).', dataEmissao: new Date().toISOString() };
      subStore.data.push(novo);
      return json(novo, 201);
    }
    // PRP-006: POST /achados/:id/manifestacoes — registra manifestação da unidade (P05).
    if (entityPath === 'achados' && subPath === 'manifestacoes' && req.body) {
      const body = req.body as any;
      const manStore = stores['manifestacoes'];
      const nova = {
        id: `mock-${Date.now()}`,
        achadoId: id,
        conteudo: body.conteudo,
        tipo: body.tipo,
        autorId: body.autorId || '',
        dataManifestacao: new Date().toISOString(),
      };
      if (manStore) manStore.data.push(nova);
      // Espelha o backend: registrar manifestação consolida o achado (teste #4 do PRP).
      const parent = store.data.find((r: any) => r[store.idKey] === id);
      if (parent) {
        parent.status = 'CONSOLIDADO';
        parent.dataConsolidacao = new Date().toISOString();
      }
      return json(nova, 201);
    }
    // PRP-006: POST /auditorias/:auditoriaId/achados — cria achado vinculado à auditoria (P02).
    if (entityPath === 'auditorias' && subPath === 'achados' && req.body) {
      const body = req.body as any;
      const achStore = stores['achados_auditoria'];
      const count = achStore ? achStore.data.filter((a: any) => a.auditoriaId === id).length + 1 : 1;
      const novo = {
        id: `mock-${Date.now()}`,
        auditoriaId: id,
        codigo: `ACH-${count}`,
        tipo: body.tipo,
        situacaoEncontrada: body.situacaoEncontrada,
        criterio: body.criterio,
        causa: body.causa,
        efeito: body.efeito,
        status: 'PRELIMINAR',
        evidenciaIds: body.evidenciaIds || [],
        autorId: body.autorId || '',
        createdAt: new Date().toISOString(),
      };
      if (achStore) achStore.data.push(novo);
      return json({ ...novo, manifestacoes: [] }, 201);
    }
    return json({ message: 'Ação executada', success: true });
  }

  // Sub-path PATCH: transições de status por id (ex: /mandatos/:id/concluir)
  if (id && subPath && (req.method === 'PATCH' || req.method === 'PUT')) {
    const item = store.data.find((r: any) => r[store.idKey] === id);
    if (!item) return json({ message: 'Not found' }, 404);
    if (subPath === 'concluir') {
      item.status = 'CONCLUIDO';
      item.dataFim = new Date().toISOString().slice(0, 10);
      const usersStore = stores['users'];
      return json({
        ...item,
        usuario: usersStore?.data.find((u: any) => u.id === item.usuarioId) || null,
        message: 'Mandato concluído',
      });
    }
    return json({ message: 'Ação executada', success: true });
  }

  // Embed sub-entidades in GET single item
  if (entityPath === 'achados' && id && !subPath && req.method === 'GET') {
    const item = store.data.find((r: any) => r[store.idKey] === id);
    if (!item) return json({ message: 'Not found' }, 404);
    const manKey = ENTITY_MAP.get('manifestacoes');
    const manifests = manKey ? (stores[manKey]?.data || []).filter((m: any) => m.achadoId === id) : [];
    return json({ ...item, manifestacoes: manifests });
  }

  if (entityPath === 'recomendacoes' && id && !subPath && req.method === 'GET') {
    const item = store.data.find((r: any) => r[store.idKey] === id);
    if (!item) return json({ message: 'Not found' }, 404);
    const provKey = ENTITY_MAP.get('providencias');
    const provs = provKey ? (stores[provKey]?.data || []).filter((p: any) => p.recomendacaoId === id) : [];
    return json({ ...item, providencias: provs });
  }

  if (req.method === 'GET' && !id) {
    const urlObj = new URL(req.url);
    const status = urlObj.searchParams.get('status') || req.params.get('status') || null;
    const search = urlObj.searchParams.get('search') || req.params.get('search') || null;
    const tipo = urlObj.searchParams.get('tipo') || req.params.get('tipo') || null;
    const criticidade = urlObj.searchParams.get('criticidade') || req.params.get('criticidade') || null;
    const auditoriaId = urlObj.searchParams.get('auditoriaId') || req.params.get('auditoriaId') || null;
    let results = [...store.data];
    if (status) results = results.filter((r: any) => r.status === status);
    if (tipo) results = results.filter((r: any) => r.tipo === tipo);
    if (criticidade) results = results.filter((r: any) => r.criticidade === criticidade);
    if (auditoriaId) results = results.filter((r: any) => r.auditoriaId === auditoriaId);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((r: any) =>
        Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    if (entityPath === 'planos') {
      const itensKey = ENTITY_MAP.get('itens-plano');
      const forcaKey = ENTITY_MAP.get('forca-trabalho');
      const itensStore = itensKey ? stores[itensKey] : null;
      const forcaStore = forcaKey ? stores[forcaKey] : null;
      results = results.map((p: any) => ({
        ...p,
        itensPlano: itensStore ? itensStore.data.filter((i: any) => i.planoId === p.id) : [],
        forcaTrabalho: forcaStore ? forcaStore.data.filter((f: any) => f.planoId === p.id) : [],
      }));
    }
    if (entityPath === 'mandatos') {
      const usersStore = stores['users'];
      results = results.map((m: any) => ({
        ...m,
        usuario: usersStore?.data.find((u: any) => u.id === m.usuarioId) || null,
      }));
    }
    return json(results);
  }

  // PDF download (relatorios/:id/pdf)
  if (entityPath === 'relatorios' && id && subPath === 'pdf' && req.method === 'GET') {
    const text = `Relatório ${id} — PDF simulado (mock).`;
    return of(new HttpResponse({ status: 200, body: text }));
  }

  if (req.method === 'GET' && id) {
    const item = store.data.find((r: any) => r[store.idKey] === id);
    if (!item) return json({ message: 'Not found' }, 404);
    return json(item);
  }

  if (req.method === 'POST' && !id) {
    const body = req.body as any;

    // Relatório Anual: gera conteúdo simulado com indicadores do exercício.
    if (entityPath === 'relatorios-anuais') {
      const ano = body.ano || new Date().getFullYear();
      const novo = {
        id: `ra-mock-${Date.now()}`,
        ano,
        status: 'GERADO',
        conteudo: `Relatório Anual de Atividades — Exercício ${ano}\n\n` +
          `1. AUDITORIAS REALIZADAS: 4\n` +
          `2. RECOMENDAÇÕES EXPEDIDAS: 12\n` +
          `3. RECOMENDAÇÕES CUMPRIDAS: 8\n` +
          `4. CONSULTORIAS: 2\n` +
          `5. CAPACITAÇÕES: 3\n\n` +
          `Indicadores:\n` +
          `- Eficácia: 75%\n` +
          `- Eficiência: 82%\n` +
          `- Tempestividade: 90%\n\n` +
          `Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}.`,
        autorId: body.autorId || '',
        dataGeracao: new Date().toISOString(),
      };
      store.data.push(novo);
      return json(novo, 201);
    }

    // Mandato: deriva numeroMandato, dataFimPrevista (+2 anos), status inicial e embute o usuário.
    if (entityPath === 'mandatos') {
      const usersStore = stores['users'];
      const usuario = usersStore?.data.find((u: any) => u.id === body.usuarioId) || null;
      const inicio = body.dataInicio ? new Date(body.dataInicio) : new Date();
      const fimPrev = new Date(inicio);
      fimPrev.setFullYear(inicio.getFullYear() + 2);
      const numero = store.data.length + 1;
      const novo = {
        id: `mand-${Date.now()}`,
        numeroMandato: numero,
        usuarioId: body.usuarioId,
        atoDesignacao: body.atoDesignacao,
        dataInicio: body.dataInicio,
        dataFimPrevista: fimPrev.toISOString().slice(0, 10),
        status: 'ATIVO',
        usuario,
      };
      store.data.push(novo);
      return json(novo, 201);
    }

    const newItem = { ...body, id: `mock-${Date.now()}` };
    store.data.push(newItem);
    return json(newItem, 201);
  }

  if ((req.method === 'PATCH' || req.method === 'PUT') && id) {
    const idx = store.data.findIndex((r: any) => r[store.idKey] === id);
    if (idx === -1) return json({ message: 'Not found' }, 404);
    const body = req.body as any;
    store.data[idx] = { ...store.data[idx], ...body };
    return json(store.data[idx]);
  }

  if (req.method === 'DELETE' && id) {
    const idx = store.data.findIndex((r: any) => r[store.idKey] === id);
    if (idx === -1) return json({ message: 'Not found' }, 404);
    store.data.splice(idx, 1);
    return json({ message: 'Deleted' });
  }

  return json({ message: 'Method not allowed' }, 405);
}
