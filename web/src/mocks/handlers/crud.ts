import { http, HttpResponse } from 'msw';
import universoData from '../../../../mocks/data/universo_auditavel.json';
import planosData from '../../../../mocks/data/planos_auditoria.json';
import auditoriasData from '../../../../mocks/data/auditorias_execucao.json';
import achadosData from '../../../../mocks/data/achados_relatorios_recomendacoes.json';
import eticaData from '../../../../mocks/data/etica_sigilo.json';
import consultoriasData from '../../../../mocks/data/consultorias_qualidade_riscos.json';
import configData from '../../../../mocks/data/perfis_configuracoes.json';
import govData from '../../../../mocks/data/governanca_fraudes.json';

const API = 'http://localhost:3001/api/v1';

type EntityStore = { data: any[]; idKey: string };

const stores: Record<string, EntityStore> = {};

function register(key: string, data: any) {
  if (Array.isArray(data)) {
    stores[key] = { data, idKey: 'id' };
  } else if (data && typeof data === 'object') {
    for (const [k, v] of Object.entries(data)) {
      if (Array.isArray(v)) {
        stores[k] = { data: v, idKey: 'id' };
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
register('determinacoes_externas', govData);
register('registros_fraude', govData);

const ENTITY_ROUTES: { path: string; entity: string }[] = [
  { path: 'universo', entity: 'universo_auditavel' },
  { path: 'planos', entity: 'planos_auditoria' },
  { path: 'auditorias', entity: 'auditorias' },
  { path: 'evidencias', entity: 'evidencias' },
  { path: 'papeis-trabalho', entity: 'papeis_trabalho' },
  { path: 'requisicoes', entity: 'requisicoes' },
  { path: 'achados', entity: 'achados' },
  { path: 'manifestacoes', entity: 'manifestacoes' },
  { path: 'recomendacoes', entity: 'recomendacoes' },
  { path: 'providencias', entity: 'providencias' },
  { path: 'relatorios', entity: 'relatorios' },
  { path: 'declaracoes', entity: 'declaracoes_independencia' },
  { path: 'impedimentos', entity: 'impedimentos' },
  { path: 'consultorias', entity: 'consultorias' },
  { path: 'capacitacoes', entity: 'capacitacoes' },
  { path: 'riscos', entity: 'riscos' },
  { path: 'avaliacoes-qualidade', entity: 'avaliacoes_qualidade' },
  { path: 'nao-conformidades', entity: 'nao_conformidades' },
  { path: 'perfis', entity: 'perfis' },
  { path: 'configuracoes', entity: 'configuracoes_sistema' },
  { path: 'dashboards', entity: 'auditorias' },
  // Rotas aninhadas de qualidade (/qualidade/avaliacoes, /qualidade/nao-conformidades, /qualidade/indicadores)
  { path: 'qualidade/avaliacoes', entity: 'avaliacoes_qualidade' },
  { path: 'qualidade/nao-conformidades', entity: 'nao_conformidades' },
  { path: 'qualidade/indicadores', entity: 'avaliacoes_qualidade' },
  // Rotas de governança (/determinacoes-externas, /registros-fraude)
  { path: 'determinacoes-externas', entity: 'determinacoes_externas' },
  { path: 'registros-fraude', entity: 'registros_fraude' },
];

export const crudHandlers = ENTITY_ROUTES.flatMap(({ path, entity }) => {
  const store = stores[entity];
  if (!store) return [];

  return [
    http.get(`${API}/${path}`, ({ request }) => {
      const url = new URL(request.url);
      const status = url.searchParams.get('status');
      const search = url.searchParams.get('search');
      const tipo = url.searchParams.get('tipo');
      let results = [...store.data];
      if (status) results = results.filter((r: any) => r.status === status);
      if (tipo) results = results.filter((r: any) => r.tipo === tipo);
      if (search) {
        const q = search.toLowerCase();
        results = results.filter((r: any) =>
          Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
        );
      }
      return HttpResponse.json(results);
    }),

    http.get(`${API}/${path}/:id`, ({ params }) => {
      const item = store.data.find((r: any) => r[store.idKey] === params['id']);
      if (!item) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      return HttpResponse.json(item);
    }),

    http.post(`${API}/${path}`, async ({ request }) => {
      const body = await request.json();
      const newItem = { ...(body as any), id: `mock-${Date.now()}` };
      store.data.push(newItem);
      return HttpResponse.json(newItem, { status: 201 });
    }),

    http.patch(`${API}/${path}/:id`, async ({ params, request }) => {
      const idx = store.data.findIndex((r: any) => r[store.idKey] === params['id']);
      if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      const body = await request.json();
      store.data[idx] = { ...store.data[idx], ...(body as any) };
      return HttpResponse.json(store.data[idx]);
    }),

    http.put(`${API}/${path}/:id`, async ({ params, request }) => {
      const idx = store.data.findIndex((r: any) => r[store.idKey] === params['id']);
      if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      const body = await request.json();
      store.data[idx] = { ...store.data[idx], ...(body as any) };
      return HttpResponse.json(store.data[idx]);
    }),

    http.delete(`${API}/${path}/:id`, ({ params }) => {
      const idx = store.data.findIndex((r: any) => r[store.idKey] === params['id']);
      if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      store.data.splice(idx, 1);
      return HttpResponse.json({ message: 'Deleted' });
    }),
  ];
});

// Handlers específicos para endpoints de workflow de qualidade (não-CRUD genérico)
const qualidadeWorkflowHandlers = [
  // POST /qualidade/avaliacoes/:id/concluir
  http.post(`${API}/qualidade/avaliacoes/:id/concluir`, ({ params }) => {
    const store = stores['avaliacoes_qualidade'];
    if (!store) return HttpResponse.json({ message: 'Store not found' }, { status: 500 });
    const idx = store.data.findIndex((r: any) => r.id === params['id']);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    store.data[idx] = { ...store.data[idx], status: 'CONCLUIDA' };
    return HttpResponse.json(store.data[idx]);
  }),

  // POST /qualidade/avaliacoes/:id/homologar
  http.post(`${API}/qualidade/avaliacoes/:id/homologar`, ({ params }) => {
    const store = stores['avaliacoes_qualidade'];
    if (!store) return HttpResponse.json({ message: 'Store not found' }, { status: 500 });
    const idx = store.data.findIndex((r: any) => r.id === params['id']);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    store.data[idx] = { ...store.data[idx], status: 'HOMOLOGADA' };
    return HttpResponse.json(store.data[idx]);
  }),

  // POST /qualidade/nao-conformidades/:id/concluir
  http.post(`${API}/qualidade/nao-conformidades/:id/concluir`, ({ params }) => {
    const store = stores['nao_conformidades'];
    if (!store) return HttpResponse.json({ message: 'Store not found' }, { status: 500 });
    const idx = store.data.findIndex((r: any) => r.id === params['id']);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    store.data[idx] = { ...store.data[idx], status: 'CORRIGIDA' };
    return HttpResponse.json(store.data[idx]);
  }),

  // POST /qualidade/avaliacoes/:avaliacaoId/nao-conformidades
  http.post(`${API}/qualidade/avaliacoes/:avaliacaoId/nao-conformidades`, async ({ params, request }) => {
    const store = stores['nao_conformidades'];
    if (!store) return HttpResponse.json({ message: 'Store not found' }, { status: 500 });
    const body = await request.json();
    const newItem = { ...(body as any), id: `mock-${Date.now()}`, avaliacaoId: params['avaliacaoId'], status: 'ABERTA' };
    store.data.push(newItem);
    return HttpResponse.json(newItem, { status: 201 });
  }),

  // PUT /qualidade/nao-conformidades/:id/acao-corretiva
  http.put(`${API}/qualidade/nao-conformidades/:id/acao-corretiva`, async ({ params, request }) => {
    const store = stores['nao_conformidades'];
    if (!store) return HttpResponse.json({ message: 'Store not found' }, { status: 500 });
    const idx = store.data.findIndex((r: any) => r.id === params['id']);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const body = await request.json();
    store.data[idx] = { ...store.data[idx], ...(body as any), status: 'EM_CORRECAO' };
    return HttpResponse.json(store.data[idx]);
  }),
];

// Handlers específicos para endpoints de workflow de governança
const governancaWorkflowHandlers = [
  // POST /determinacoes-externas/:id/concluir
  http.post(`${API}/determinacoes-externas/:id/concluir`, ({ params }) => {
    const store = stores['determinacoes_externas'];
    if (!store) return HttpResponse.json({ message: 'Store not found' }, { status: 500 });
    const idx = store.data.findIndex((r: any) => r.id === params['id']);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    store.data[idx] = { ...store.data[idx], status: 'CONCLUIDA' };
    return HttpResponse.json(store.data[idx]);
  }),

  // POST /registros-fraude/:id/comunicar
  http.post(`${API}/registros-fraude/:id/comunicar`, async ({ params, request }) => {
    const store = stores['registros_fraude'];
    if (!store) return HttpResponse.json({ message: 'Store not found' }, { status: 500 });
    const idx = store.data.findIndex((r: any) => r.id === params['id']);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const body: any = await request.json();
    const now = new Date().toISOString();
    if (body.tipo === 'SUPERIOR') {
      store.data[idx] = { ...store.data[idx], dataComunicacaoSuperior: now };
    } else if (body.tipo === 'TCE') {
      store.data[idx] = { ...store.data[idx], dataComunicacaoTce: now };
    }
    return HttpResponse.json(store.data[idx]);
  }),

  // PUT /determinacoes-externas/:id (genérico já trata, mas PUT precisa de handler explícito)
  // O CRUD genérico já captura PUT via http.put — verificar se funciona
  // Se o CRUD genérico não tem PUT, adicionar um handler para determinacoes-externas/:id
];

export { qualidadeWorkflowHandlers, governancaWorkflowHandlers };
