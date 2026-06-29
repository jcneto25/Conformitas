import { http, HttpResponse } from 'msw';
import usersData from '../data/users.json';

const API = 'http://localhost:3001/api/v1';

const users = (usersData as any).users;

export const authHandlers = [
  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as any;
    const user = users.find((u: any) => u.email === body.email && u.senha === body.senha);
    if (!user) {
      return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }
    if (user.mfaEnabled) {
      return HttpResponse.json({ mfa_required: true, session_token: 'mock-session-token' });
    }
    return HttpResponse.json({
      access_token: `mock-at-${user.id}`,
      refresh_token: `mock-rt-${user.id}`,
      expires_in: 1800,
    });
  }),

  http.post(`${API}/auth/mfa/verify`, async () => {
    const user = users[0];
    return HttpResponse.json({
      access_token: `mock-at-${user.id}`,
      refresh_token: `mock-rt-${user.id}`,
      expires_in: 1800,
    });
  }),

  http.post(`${API}/auth/refresh`, async () => {
    const user = users[0];
    return HttpResponse.json({
      access_token: `mock-at-${user.id}-refreshed`,
      refresh_token: `mock-rt-${user.id}-refreshed`,
      expires_in: 1800,
    });
  }),

  http.post(`${API}/auth/logout`, () => {
    return HttpResponse.json({ message: 'Logout realizado' });
  }),

  http.get(`${API}/auth/profile`, ({ request }) => {
    const auth = request.headers.get('Authorization') || '';
    const token = auth.replace('Bearer ', '');
    const userId = token.replace('mock-at-', '').replace('-refreshed', '');
    const user = users.find((u: any) => u.id === userId) || users[0];
    return HttpResponse.json({
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
  }),
];
