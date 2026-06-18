# Guia de Testes — CONFORMITAS 3.0

**Versão:** 1.0 | **Data:** 2026-06-16 | **Status:** Gerado (Step 9)
**Stack:** Angular 19 + NestJS 11 + PostgreSQL | **Ferramentas:** Jasmine/Karma + Jest + Supertest

---

## 1. Filosofia e Pirâmide de Testes

```
        ╱ E2E ╲        10% — Fluxos críticos (Playwright)
       ╱────────╲
      ╱ Integração╲     30% — Controllers + DB (Jest + Supertest + Prisma)
     ╱──────────────╲
    ╱   Unitários    ╲   60% — Services, Guards, Pipes (Jest / Jasmine)
   ╱──────────────────╲
```

- **Unitários:** Testam lógica isolada. Rápidos, sem I/O real.
- **Integração:** Testam controllers com DB real (test container ou SQLite in-memory). Verificam contratos de API.
- **E2E:** Testam fluxos completos do usuário no browser. Simulam perfil e permissões.

### Proporção Alvo
| Camada | Alvo | Ferramenta Backend | Ferramenta Frontend |
|--------|------|--------------------|---------------------|
| Unitários | ≥ 80% | Jest | Jasmine/Karma |
| Integração | ≥ 70% | Jest + Supertest + Prisma | — |
| E2E | Fluxos críticos | — | Playwright |

---

## 2. TDD — Red, Green, Refactor

### Ciclo
1. **Red:** Escreva o teste antes do código. Execute — deve falhar.
2. **Green:** Escreva o código mínimo para o teste passar.
3. **Refactor:** Melhore o código sem quebrar os testes.

### Red Flags (o que NÃO fazer)
- ❌ Mockar o que está sendo testado (ex: mockar `UserService` em `UserService.spec.ts`)
- ❌ Testar implementação em vez de comportamento
- ❌ Testes sem assertions
- ❌ Depender de ordem de execução entre testes

---

## 3. Setup por Aplicação

### 3.1 Backend (NestJS + Jest + Supertest)

**jest.config.ts**
```typescript
export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/*.module.ts', '!main.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
};
```

**Comando:** `npm run test:api` — unitários | `npm run test:api:e2e` — integração | `npm run test:api:cov` — cobertura

### 3.2 Frontend (Angular + Jasmine/Karma)

**karma.conf.js** (gerado pelo Angular CLI)
```javascript
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'lcov' }, { type: 'text-summary' }]
    },
    reporters: ['progress', 'coverage'],
    browsers: ['ChromeHeadless'],
    singleRun: true
  });
};
```

**Comando:** `ng test --watch=false --code-coverage`

---

## 4. Templates de Teste

### 4.1 Teste de Service (NestJS)

```typescript
// auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('mock-token') } },
        { provide: PrismaService, useValue: { usuario: { findUnique: jest.fn() } } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('login', () => {
    it('deve retornar access token quando credenciais são válidas', async () => {
      // Arrange
      const mockUser = { id: '1', email: 'teste@tjce.jus.br', senha_hash: '$2b$12$...', ativo: true };
      jest.spyOn(prisma.usuario, 'findUnique').mockResolvedValue(mockUser);

      // Act
      const result = await service.login({ email: 'teste@tjce.jus.br', senha: '123456' });

      // Assert
      expect(result).toHaveProperty('access_token');
    });

    it('deve lançar UnauthorizedException quando usuário não encontrado', async () => {
      jest.spyOn(prisma.usuario, 'findUnique').mockResolvedValue(null);
      await expect(service.login({ email: 'x@x.com', senha: '123' }))
        .rejects.toThrow('Credenciais inválidas');
    });
  });
});
```

### 4.2 Teste de Controller com Supertest (NestJS)

```typescript
// auth.controller.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => await app.close());

  describe('POST /api/v1/auth/login', () => {
    it('deve retornar 200 com token para credenciais válidas', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'romulo.ribeiro@mvp.local', senha: '123456' })
        .expect(200)
        .expect(res => expect(res.body.access_token).toBeDefined());
    });

    it('deve retornar 401 para credenciais inválidas', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'x@x.com', senha: 'errada' })
        .expect(401);
    });

    it('deve bloquear após 5 tentativas com falha', async () => {
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({ email: 'romulo.ribeiro@mvp.local', senha: 'errada' });
      }
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'romulo.ribeiro@mvp.local', senha: '123456' })
        .expect(423); // Locked
    });
  });
});
```

### 4.3 Teste de Componente Angular

```typescript
// login.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [LoginComponent],
      providers: [AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => expect(component).toBeTruthy());

  it('deve exibir erro quando email está vazio', () => {
    component.form.patchValue({ email: '', senha: '123456' });
    component.onSubmit();
    expect(component.form.controls['email'].invalid).toBeTrue();
  });

  it('deve chamar authService.login ao submeter formulário válido', () => {
    const spy = spyOn(authService, 'login').and.returnValue(of({ access_token: 'token' } as any));
    component.form.patchValue({ email: 'teste@tjce.jus.br', senha: '123456' });
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });
});
```

### 4.4 Teste E2E (Playwright)

```typescript
// login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Login', () => {
  test('login com sucesso redireciona ao dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'romulo.ribeiro@mvp.local');
    await page.fill('[data-testid="senha-input"]', '123456');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-name"]')).toContainText('Rômulo');
  });

  test('credenciais inválidas exibem mensagem de erro', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'invalido@tjce.jus.br');
    await page.fill('[data-testid="senha-input"]', 'errada');
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('.toast-error')).toBeVisible();
  });
});
```

---

## 5. Estratégia de Mocks

| Cenário | Estratégia | Ferramenta |
|---------|------------|------------|
| Teste unitário de service | Mock do Prisma Service | Jest mock |
| Teste unitário de guard/pipe | Mock do ExecutionContext | Jest mock |
| Teste de integração controller | DB real (SQLite in-memory para testes) | Prisma + SQLite |
| Teste de componente Angular | Mock do HttpClient com dados mock | HttpClientTestingModule |
| Teste E2E | Dados mockados em memória | MSW ou JSON fixtures |

**Regra:** Mock externo, não interno. Nunca mockar a classe que está sendo testada.

---

## 6. Gestão de Dados de Teste

### Factories (Faker)

```typescript
// test/factories/usuario.factory.ts
import { faker } from '@faker-js/faker';

export function createUsuario(overrides?: Partial<any>) {
  return {
    id: faker.string.uuid(),
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    matricula: `TJCE-${faker.number.int({ min: 100, max: 999 })}`,
    cargo: 'Auditor',
    unidade: 'AUDIN',
    senha_hash: '$2b$12$...',
    mfa_enabled: false,
    ativo: true,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}
```

---

## 7. Acessibilidade (a11y)

- **Angular Material** já provê componentes acessíveis nativamente
- Complementar com `axe-core` em testes E2E
- Checklist manual: contraste, foco visível, navegação por teclado, aria-labels

---

## 8. CI/CD e Quality Gates

| Gate | Ambiente | Critério |
|------|----------|----------|
| Lint + TypeCheck | Todos | Zero erros |
| Testes unitários | Dev | Todos passando |
| Cobertura unitários | Staging | ≥ 80% backend, ≥ 80% frontend |
| Cobertura integração | Staging | ≥ 70% backend |
| Testes E2E | Staging | Fluxos críticos passando |
| Security scan | Staging | Zero vulnerabilidades críticas |
| Code review | Staging | 1+ aprovação |

---

## 9. Troubleshooting

| Problema | Solução |
|----------|---------|
| Teste de integração lento | Usar SQLite in-memory em vez de PostgreSQL |
| Flaky test E2E | Adicionar `waitForSelector` ou `waitForResponse` |
| Cobertura não sobe | Verificar `collectCoverageFrom` no jest.config |
| Mock não funciona | Verificar ordem dos providers no `Test.createTestingModule` |

---

**Versão:** 1.0 | **Data:** 2026-06-16
