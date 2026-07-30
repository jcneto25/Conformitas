import request from 'supertest';

/**
 * E2E tests for Auth flow (RF-001)
 * 
 * Hitting the already-running API on port 3001 (Docker).
 * API: POST /api/v1/auth/login
 *      POST /api/v1/auth/mfa/verify
 *      POST /api/v1/auth/refresh
 */
const API = 'http://localhost:3001';
const PREFIX = '/api/v1';

describe('Auth (e2e) — RF-001 Autenticação', () => {
  const VALID_EMAIL = 'admin@audin.tjce.gov.br';
  const VALID_PASSWORD = 'Admin@123456';
  const INVALID_EMAIL = 'inexistente@teste.com';
  const INVALID_PASSWORD = 'SenhaErrada123!';

  // ── POST /api/v1/auth/login ──────────────────────

  describe('POST /api/v1/auth/login (RF-001.1)', () => {
    it('deve retornar 201 com tokens para credenciais válidas (sem MFA)', async () => {
      const res = await request(API)
        .post(`${PREFIX}/auth/login`)
        .send({ email: VALID_EMAIL, senha: VALID_PASSWORD })
        .expect(201);

      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('refresh_token');
      expect(res.body).toHaveProperty('expires_in', 1800);
      expect(typeof res.body.access_token).toBe('string');
      expect(res.body.access_token.split('.')).toHaveLength(3); // JWT format
    });

    it('deve retornar 401 para email inexistente', async () => {
      const res = await request(API)
        .post(`${PREFIX}/auth/login`)
        .send({ email: INVALID_EMAIL, senha: VALID_PASSWORD })
        .expect(401);

      expect(res.body.message).toMatch(/Credenciais inválidas/i);
    });

    it('deve retornar 401 para senha incorreta', async () => {
      const res = await request(API)
        .post(`${PREFIX}/auth/login`)
        .send({ email: VALID_EMAIL, senha: INVALID_PASSWORD })
        .expect(401);

      expect(res.body.message).toMatch(/Credenciais inválidas/i);
    });

    it('deve retornar 422 para payload sem email', async () => {
      const res = await request(API)
        .post(`${PREFIX}/auth/login`)
        .send({ senha: VALID_PASSWORD })
        .expect(422);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/email/i),
        ]),
      );
    });

    it('deve retornar 422 para payload sem senha', async () => {
      const res = await request(API)
        .post(`${PREFIX}/auth/login`)
        .send({ email: VALID_EMAIL })
        .expect(422);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/senha/i),
        ]),
      );
    });

    it('deve retornar 422 para email inválido', async () => {
      await request(API)
        .post(`${PREFIX}/auth/login`)
        .send({ email: 'invalido', senha: VALID_PASSWORD })
        .expect(422);
    });
  });

  // ── POST /api/v1/auth/refresh ─────────────────────

  describe('POST /api/v1/auth/refresh (RF-001.4)', () => {
    let validRefreshToken: string;

    beforeAll(async () => {
      const loginRes = await request(API)
        .post(`${PREFIX}/auth/login`)
        .send({ email: VALID_EMAIL, senha: VALID_PASSWORD })
        .expect(201);
      validRefreshToken = loginRes.body.refresh_token;
    });

    it('deve renovar tokens com refresh token válido', async () => {
      const res = await request(API)
        .post(`${PREFIX}/auth/refresh`)
        .send({ refresh_token: validRefreshToken })
        .expect(201);

      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('refresh_token');
      expect(res.body).toHaveProperty('expires_in', 1800);
      expect(res.body.refresh_token).not.toBe(validRefreshToken); // rotação
    });

    it('deve retornar 401 para refresh token inválido', async () => {
      const res = await request(API)
        .post(`${PREFIX}/auth/refresh`)
        .send({ refresh_token: '00000000-0000-0000-0000-000000000000' })
        .expect(401);

      expect(res.body.message).toMatch(/inválido|expirado/i);
    });

    it('deve retornar 401 para refresh token já utilizado (rotação)', async () => {
      await request(API)
        .post(`${PREFIX}/auth/refresh`)
        .send({ refresh_token: validRefreshToken })
        .expect(401);
    });

    it('deve retornar 422 para payload sem refresh_token', async () => {
      await request(API)
        .post(`${PREFIX}/auth/refresh`)
        .send({})
        .expect(422);
    });
  });

  // ── POST /api/v1/auth/mfa/verify ──────────────────

  describe('POST /api/v1/auth/mfa/verify (RF-001.2)', () => {
    it('deve retornar 401 para token de sessão MFA inválido', async () => {
      const res = await request(API)
        .post(`${PREFIX}/auth/mfa/verify`)
        .send({ session_token: 'uuid-invalido', totp_code: '123456' })
        .expect(401);

      expect(res.body.message).toMatch(/MFA|inválida|expirada/i);
    });

    it('deve retornar 422 para payload sem totp_code', async () => {
      await request(API)
        .post(`${PREFIX}/auth/mfa/verify`)
        .send({ session_token: 'uuid-qualquer' })
        .expect(422);
    });

    it('deve retornar 422 para payload sem session_token', async () => {
      await request(API)
        .post(`${PREFIX}/auth/mfa/verify`)
        .send({ totp_code: '123456' })
        .expect(422);
    });
  });
});