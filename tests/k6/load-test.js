import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const FAIL_RATE = new Rate('failed_requests');
const LOGIN_DURATION = new Trend('login_duration');
const LIST_DURATION = new Trend('list_duration');

export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Ramp up to 5 VUs
    { duration: '30s', target: 5 },   // Stay at 5 VUs
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    failed_requests: ['rate<0.05'],       // < 5% de erros
    http_req_duration: ['p(95)<3000'],    // 95% das requests < 3s
    login_duration: ['p(95)<2000'],       // Login < 2s
    list_duration: ['p(95)<2000'],        // Listagem < 2s
  },
};

const BASE_URL = __ENV['API_BASE_URL'] || 'http://localhost:3001/api/v1';
const USERS = [
  { email: 'auditor-chefe@audin.tjce.gov.br', password: 'Admin@123456', role: 'P01' },
  { email: 'auditor@audin.tjce.gov.br', password: 'Admin@123456', role: 'P02' },
];

export default function () {
  group('Autenticação', () => {
    const user = USERS[Math.floor(Math.random() * USERS.length)];

    const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
      email: user.email,
      password: user.password,
    }), { headers: { 'Content-Type': 'application/json' } });

    LOGIN_DURATION.add(loginRes.timings.duration);
    const loginOk = check(loginRes, {
      'login retorna 201 ou 200': (r) => r.status === 201 || r.status === 200,
      'login retorna token': (r) => r.json('access_token') !== undefined || r.json('token') !== undefined,
    });
    FAIL_RATE.add(!loginOk);

    if (loginOk) {
      const token = loginRes.json('access_token') || loginRes.json('token');
      const authHeaders = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      sleep(1);

      group('Listagens', () => {
        const endpoints = ['auditorias', 'planos', 'achados', 'recomendacoes'];

        for (const ep of endpoints) {
          const listRes = http.get(`${BASE_URL}/${ep}`, authHeaders);
          LIST_DURATION.add(listRes.timings.duration);
          const listOk = check(listRes, {
            [`GET /${ep} retorna 200`]: (r) => r.status === 200,
            [`GET /${ep} retorna array`]: (r) => Array.isArray(r.json()),
          });
          FAIL_RATE.add(!listOk);
          sleep(0.5);
        }
      });

      sleep(1);
    }
  });
}
