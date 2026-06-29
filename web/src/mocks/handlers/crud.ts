import { http, HttpResponse } from 'msw';
import universoData from '../../../../mocks/data/universo_auditavel.json';
import planosData from '../../../../mocks/data/planos_auditoria.json';
import auditoriasData from '../../../../mocks/data/auditorias_execucao.json';
import achadosData from '../../../../mocks/data/achados_relatorios_recomendacoes.json';
import eticaData from '../../../../mocks/data/etica_sigilo.json';
import consultoriasData from '../../../../mocks/data/consultorias_qualidade_riscos.json';
import configData from '../../../../mocks/data/perfis_configuracoes.json';

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

    http.delete(`${API}/${path}/:id`, ({ params }) => {
      const idx = store.data.findIndex((r: any) => r[store.idKey] === params['id']);
      if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      store.data.splice(idx, 1);
      return HttpResponse.json({ message: 'Deleted' });
    }),
  ];
});
