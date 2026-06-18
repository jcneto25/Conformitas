# CONFORMITAS

![Versão](https://img.shields.io/badge/versão-3.0-blue) ![Status](https://img.shields.io/badge/status-Planejamento%20Concluído-green) ![Pipeline](https://img.shields.io/badge/LLC-Step%2010-8A2BE2)

**Sistema Integrado de Gestão de Auditoria Interna Governamental**

Plataforma corporativa para gestão do ciclo completo de auditoria interna, em conformidade com a Lei Estadual 18.561/2023 e as Resoluções CNJ 308/2020 e 309/2020 (DIRAUD-Jud).

---

## 🏗️ Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Frontend | Angular + Angular Material + TailwindCSS | 19 / 4 |
| Backend | Node.js + NestJS | 22 LTS / 11 |
| Linguagem | TypeScript | 5 |
| Banco | PostgreSQL | 16 |
| ORM | Prisma | 6 |
| Cache/Filas | Redis + BullMQ | 7 |
| Autenticação | JWT + TOTP (local) / Keycloak OIDC (opcional) | — |
| Infra | Docker Compose + Nginx | — |
| CI/CD | GitHub Actions (self-hosted TJCE) | — |

---

## 📁 Estrutura do Projeto

```
conformitas/
├── web/                    # Angular 19 SPA
├── api/                    # NestJS 11 API
├── mocks/                  # Dados mockados (JSON)
│   ├── data/               # 8 arquivos JSON por entidade
│   └── handlers/           # MSW handlers (auth + CRUD)
├── docs/                   # Documentação LLC
│   ├── architecture/       # ARCHITECTURE.md (C4, ADRs)
│   ├── business/           # Visão, specs, módulos, ingestão
│   ├── design/             # DESIGN_SYSTEM.md
│   ├── planning/           # PLAN, DEPENDENCY_MATRIX, EXECUTION_WAVES, TASKS
│   ├── prd/                # PRDs Executivo e Técnico
│   ├── prps/               # 14 PRPs
│   ├── security/           # Security audit reports
│   ├── testing/            # TESTING_GUIDE, COVERAGE_BASELINE, COVERAGE_PROGRESS
│   └── user-guide/         # Manual do usuário
├── docker-compose.yml      # PostgreSQL + Redis + API + Web + Nginx
└── README.md
```

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js ≥ 22 LTS
- PostgreSQL ≥ 16
- Redis ≥ 7
- Docker + Docker Compose
- Angular CLI (`npm i -g @angular/cli`)

### Instalação

```bash
git clone [url-repositorio-tjce]
cd conformitas

# Instalar dependências
cd api && npm install
cd ../web && npm install

# Iniciar banco e Redis
docker compose up -d postgres redis

# Executar migrations
cd api && npx prisma migrate dev

# Popular dados mockados
cd api && npx prisma db seed
```

### Desenvolvimento

```bash
# Terminal 1 — API NestJS (porta 3001)
cd api && npm run start:dev

# Terminal 2 — Angular (porta 4200)
cd web && ng serve

# Acessar: http://localhost:4200
```

### Testes

```bash
cd api && npm run test          # Unitários
cd api && npm run test:e2e      # Integração
cd api && npm run test:cov      # Cobertura
cd web && ng test               # Unitários Angular
cd web && ng test --code-coverage  # Cobertura Angular
```

### Build

```bash
cd api && npm run build         # Build NestJS
cd web && ng build --prod       # Build Angular
docker compose up -d --build    # Deploy completo Docker
```

---

## 🔐 Perfis de Acesso (Mock)

| Perfil | Nome | Email | Senha |
|--------|------|-------|-------|
| P01 | Rômulo Pinheiro Ribeiro (Auditor-Chefe) | romulo.ribeiro@mvp.local | 123456 |
| P02 | Carlos André Melo Pontes (Auditor) | carlos.pontes@mvp.local | 123456 |
| P02 | Karla Caldas Borges (Auditora) | karla.borges@mvp.local | 123456 |
| P02 | Juliana Alencar Alves (Auditora) | juliana.alves@mvp.local | 123456 |
| P02 | Lídia Maria Mendes dos Santos (Auditora) | lidia.santos@mvp.local | 123456 |
| P03 | Des. Maria Nailde (Presidente) | presidencia@mvp.local | 123456 |
| P04 | Conselho da Magistratura | colegiado@mvp.local | 123456 |
| P05 | Fernando Gestor (Finanças) | gestor.financas@mvp.local | 123456 |
| P05 | Ana Gestora (Pessoas) | gestora.pessoas@mvp.local | 123456 |
| P05 | Ricardo Gestor (TI) | gestor.ti@mvp.local | 123456 |
| P05 | Paulo Gestor (Administração) | gestor.administracao@mvp.local | 123456 |
| P06 | Marcos (Núcleo Controle Interno) | nucleo.controle@mvp.local | 123456 |
| P07 | Avaliador Externo TJBA | avaliador.externo@mvp.local | 123456 |
| P08 | Comitê SIAUD-Jud | comite.siaud@mvp.local | 123456 |
| P09 | Conselheiro CNJ — CPA | cpa.cnj@mvp.local | 123456 |
| P10 | Admin do Sistema | admin.sistema@mvp.local | 123456 |

---

## 📚 Documentação

| Documento | Local | Descrição |
|-----------|-------|-----------|
| Visão Estratégica | `docs/business/specs/visao_estrategica_e_negocio.md` | Objetivos, escopo, atores |
| Módulos | `docs/business/specs/MOD-*.md` | 15 módulos detalhados |
| 7 Especificações | `docs/business/specs/` | Glossário, RF, RNF, RN, BPMN, Perfis, Integrações |
| PRD Executivo | `docs/prd/executive_PRD.md` | Requisitos para stakeholders |
| PRD Técnico | `docs/prd/PRD_tecnico_institucional.md` | Especificação técnica completa |
| PRPs | `docs/prps/PRP-*.md` | 14 contratos de implementação |
| Arquitetura | `docs/architecture/ARCHITECTURE.md` | Stack, C4, 7 ADRs, CI/CD |
| Design System | `docs/design/DESIGN_SYSTEM.md` | Tokens, 17 componentes, padrões |
| Guia de Testes | `docs/testing/TESTING_GUIDE.md` | Estratégia e templates |
| Cobertura | `docs/testing/COVERAGE_BASELINE.md` | Baseline de cobertura |
| Deploy | `docs/DEPLOYMENT.md` | Ambientes, pipelines, rollback |

---

## 🤖 Pipeline LLC

Este projeto segue a metodologia **Live and Let Code (LLC)**.

| Step | Nome | Status |
|------|------|--------|
| 0-1 | Ingestão e Conversão | ✅ |
| 0.5 | Visão Estratégica + Módulos | ✅ |
| 1 | 7 Especificações | ✅ |
| 2 | PRDs | ✅ |
| 3 | PRPs (14) | ✅ |
| 4 | Planejamento | ✅ |
| 5 | Arquitetura | ✅ |
| 6 | Tarefas (148) | ✅ |
| 7 | Design System | ✅ |
| 8 | Setup + Mock Data | ✅ |
| 9 | Documentação de Testes | ✅ |
| **10** | **Documentos do Projeto** | ✅ |
| 11 | Execução | ⏳ |

**Próximo passo:** Execução dos PRPs (Ondas 1-4).

---

**Versão:** 3.0 | **Órgão:** TJCE — AUDIN | **Licença:** Proprietária (TJCE)
