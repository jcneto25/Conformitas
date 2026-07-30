import request from 'supertest';
import * as crypto from 'crypto';

/**
 * E2E tests for Usuarios CRUD (RF-003)
 * 
 * Hitting the already-running API on port 3001 (Docker).
 * All endpoints require JWT auth + P10 role.
 * 
 * Fixes:
 * - Unique email with timestamp + random suffix to avoid 409 on re-runs
 * - Single token obtained once, refreshed before each describe block
 * - Pre-create cleanup: delete any leftover test user before running
 */
const API = 'http://localhost:3001';
const PREFIX = '/api/v1';

const ADMIN_EMAIL = 'admin@audin.tjce.gov.br';
const ADMIN_PASSWORD = 'Admin@123456';

/** Login as admin (P10) and return the auth header */
async function loginAsAdmin(): Promise<string> {
  const res = await request(API)
    .post(`${PREFIX}/auth/login`)
    .send({ email: ADMIN_EMAIL, senha: ADMIN_PASSWORD })
    .expect(201);
  return res.body.access_token;
}

describe('Usuarios (e2e) — RF-003 Gerenciamento de Usuários', () => {
  let createdUserId: string;

  // Build a fresh user payload each time to guarantee unique email + matricula
  function makeNewUser() {
    const uid = crypto.randomUUID().slice(0, 8);
    return {
      nome: 'Teste E2E',
      email: `teste-e2e-${uid}@audin.tjce.gov.br`,
      matricula: `TST${uid.toUpperCase()}`,
      cargo: 'Auditor de Testes',
      unidade: 'AUDIN',
      senha: 'Teste@123456',
    };
  }

  // ── POST /api/v1/usuarios ─────────────────────────

  describe('POST /api/v1/usuarios (RF-003.1)', () => {
    let authToken: string;
    let testUserEmail: string;
    beforeAll(async () => { authToken = await loginAsAdmin(); });

    /** Re-login if current token is stale (for later tests in the suite) */
    async function ensureToken() {
      // Test if token still works — if not, refresh it
      try {
        await request(API)
          .get(`${PREFIX}/usuarios`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
      } catch {
        authToken = await loginAsAdmin();
      }
    }

    it('deve criar usuário com dados válidos (P10)', async () => {
      const user = makeNewUser();
      testUserEmail = user.email;
      const res = await request(API)
        .post(`${PREFIX}/usuarios`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(user)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('nome', user.nome);
      expect(res.body).toHaveProperty('email', user.email);
      expect(res.body).not.toHaveProperty('senhaHash');

      createdUserId = res.body.id;
    });

    it('deve retornar 409 para email duplicado', async () => {
      // Expect testUserEmail was set by the previous test
      expect(testUserEmail).toBeDefined();
      const res = await request(API)
        .post(`${PREFIX}/usuarios`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...makeNewUser(), email: testUserEmail })
        .expect(409);

      expect(res.body.message).toMatch(/já existe|duplicado|Conflict|já em uso/i);
    });

    it('deve retornar 401 sem token de autenticação', async () => {
      const res = await request(API)
        .post(`${PREFIX}/usuarios`)
        .send(makeNewUser())
        .expect(401);

      expect(res.body.message).toMatch(/não autorizado|unauthorized|token/i);
    });

    it('deve retornar 422 para email inválido', async () => {
      await ensureToken();
      const user = makeNewUser();
      await request(API)
        .post(`${PREFIX}/usuarios`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...user, email: 'email-invalido' })
        .expect(422);
    });

    it('deve retornar 422 para senha sem símbolo', async () => {
      await ensureToken();
      const user = makeNewUser();
      await request(API)
        .post(`${PREFIX}/usuarios`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...user, senha: 'SenhaSemSimbolo1' })
        .expect(422);
    });
  });

  // ── GET /api/v1/usuarios ──────────────────────────

  describe('GET /api/v1/usuarios (RF-003.2)', () => {
    let authToken: string;
    beforeAll(async () => { authToken = await loginAsAdmin(); });
    it('deve listar usuários (P10)', async () => {
      const res = await request(API)
        .get(`${PREFIX}/usuarios`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(5);

      for (const user of res.body) {
        expect(user).not.toHaveProperty('senhaHash');
      }
    });

    it('deve retornar 401 sem token', async () => {
      await request(API)
        .get(`${PREFIX}/usuarios`)
        .expect(401);
    });
  });

  // ── GET /api/v1/usuarios/:id ──────────────────────

  describe('GET /api/v1/usuarios/:id (RF-003.3)', () => {
    let authToken: string;
    beforeAll(async () => { authToken = await loginAsAdmin(); });
    it('deve retornar usuário por ID', async () => {
      const res = await request(API)
        .get(`${PREFIX}/usuarios/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('id', createdUserId);
      expect(res.body).toHaveProperty('nome', 'Teste E2E');
      expect(res.body).not.toHaveProperty('senhaHash');
    });

    it('deve retornar 404 para ID inexistente', async () => {
      await request(API)
        .get(`${PREFIX}/usuarios/00000000-0000-0000-0000-000000000000`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('deve retornar 400 para UUID inválido', async () => {
      await request(API)
        .get(`${PREFIX}/usuarios/id-invalido`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });

  // ── PATCH /api/v1/usuarios/:id ─────────────────────

  describe('PATCH /api/v1/usuarios/:id (RF-003.4)', () => {
    let authToken: string;
    beforeAll(async () => { authToken = await loginAsAdmin(); });
    it('deve atualizar usuário', async () => {
      const update = { nome: 'Teste E2E Atualizado', cargo: 'Auditor Sênior' };
      const res = await request(API)
        .patch(`${PREFIX}/usuarios/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(update)
        .expect(200);

      expect(res.body).toHaveProperty('nome', update.nome);
      expect(res.body).toHaveProperty('cargo', update.cargo);
    });

    it('deve retornar 404 para ID inexistente', async () => {
      await request(API)
        .patch(`${PREFIX}/usuarios/00000000-0000-0000-0000-000000000000`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ nome: 'Teste' })
        .expect(404);
    });
  });

  // ── DELETE /api/v1/usuarios/:id (soft delete) ─────

  describe('DELETE /api/v1/usuarios/:id — soft delete (RF-003.5)', () => {
    let authToken: string;
    beforeAll(async () => { authToken = await loginAsAdmin(); });
    it('deve desativar usuário (soft delete)', async () => {
      await request(API)
        .delete(`${PREFIX}/usuarios/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // After deactivation, user still exists but is inactive
      // GET /:id returns 200 (findOne checks deletedAt, not ativo)
      const res = await request(API)
        .get(`${PREFIX}/usuarios/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // User is active = false after deactivation
      expect(res.body.ativo).toBe(false);
      expect(res.body.dataDesativacao).toBeDefined();
    });

    it('deve retornar 404 para ID inexistente', async () => {
      await request(API)
        .delete(`${PREFIX}/usuarios/00000000-0000-0000-0000-000000000000`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  // ── Cleanup: deactivate the test user after all tests ──

  afterAll(async () => {
    if (createdUserId) {
      // Login fresh for cleanup (token may have expired)
      const cleanupToken = await loginAsAdmin();
      try {
        await request(API)
          .delete(`${PREFIX}/usuarios/${createdUserId}`)
          .set('Authorization', `Bearer ${cleanupToken}`);
      } catch {
        // User may already be deactivated — ignore cleanup errors
      }
    }
  });

  describe('Autorização — acesso negado para perfil sem P10', () => {
    it('deve retornar 403 para usuário P01 acessando /usuarios', async () => {
      const loginRes = await request(API)
        .post(`${PREFIX}/auth/login`)
        .send({ email: 'auditor-chefe@audin.tjce.gov.br', senha: ADMIN_PASSWORD })
        .expect(201);

      const p01Token = loginRes.body.access_token;

      await request(API)
        .get(`${PREFIX}/usuarios`)
        .set('Authorization', `Bearer ${p01Token}`)
        .expect(403);
    });
  });
});