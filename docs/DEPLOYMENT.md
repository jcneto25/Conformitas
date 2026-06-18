# DEPLOYMENT.md — Estratégia de Deploy

**Projeto:** CONFORMITAS 3.0 (SGI) | **Versão:** 1.0 | **Data:** 2026-06-16

---

## 1. Ambientes

| Ambiente | Finalidade | Infraestrutura | Branch | Deploy |
|----------|------------|----------------|--------|--------|
| **Dev** | Desenvolvimento local | Docker Compose (dev) | `develop` | Automático (push) |
| **Staging** | Homologação AUDIN | Docker Compose (servidor TJCE) | `release/*` | Manual (aprovação) |
| **Produção** | TJCE — AUDIN | Docker Compose (servidor TJCE) | `main` | Manual (tag + 2 aprovações) |

---

## 2. Pipeline CI/CD

```mermaid
graph LR
    A[Git Push] --> B[Lint + TypeCheck]
    B --> C[Testes Unitários]
    C --> D[Build Docker Images]
    D --> E{Cobertura ≥ 80%?}
    E -->|Sim| F{Ambiente}
    E -->|Não| G[Falha — Corrigir]
    F -->|develop| H[Deploy Dev]
    F -->|release/*| I[Deploy Staging + E2E]
    F -->|main tag| J[Security Scan]
    J --> K{Aprovado?}
    K -->|Sim| L[Deploy Produção]
    K -->|Não| M[Bloqueado]
```

### Quality Gates por Ambiente

| Ambiente | Gates |
|----------|-------|
| **Dev** | Lint + type-check + unit tests passando |
| **Staging** | Unitários ≥ 80% + Integração ≥ 70% + E2E críticos passando |
| **Produção** | Unitários ≥ 90% + Integração ≥ 80% + Security scan limpo + 2 aprovações |

---

## 3. Serviços (Docker Compose)

| Serviço | Container | Porta Interna | Porta Externa |
|---------|-----------|---------------|---------------|
| `web` | Angular SPA (Nginx) | 80 | 4200 (dev) / 80 (prod) |
| `api` | NestJS API | 3001 | 3001 |
| `postgres` | PostgreSQL 16 | 5432 | 5432 |
| `redis` | Redis 7 | 6379 | 6379 |
| `nginx` | Nginx Reverse Proxy | 80/443 | 80/443 |

---

## 4. Variáveis de Ambiente

| Variável | Dev | Staging | Prod | Descrição |
|----------|-----|---------|------|-----------|
| `DATABASE_URL` | `postgresql://postgres:postgres@postgres:5432/conformitas_dev` | `[secreto]` | `[secreto]` | Conexão PostgreSQL |
| `REDIS_URL` | `redis://redis:6379` | `[secreto]` | `[secreto]` | Conexão Redis |
| `JWT_SECRET` | `dev-secret-change-me` | `[secreto]` | `[secreto]` | Chave assinatura JWT |
| `JWT_EXPIRES_IN` | `1800` | `1800` | `1800` | Expiração access token (30 min) |
| `REFRESH_EXPIRES_IN` | `28800` | `28800` | `28800` | Expiração refresh token (8h) |
| `TOTP_ISSUER` | `CONFORMITAS-DEV` | `CONFORMITAS-TJCE` | `CONFORMITAS-TJCE` | Emissor TOTP |
| `AUTH_PROVIDER` | `local` | `keycloak` | `keycloak` | `local` ou `keycloak` |
| `KEYCLOAK_URL` | — | `[secreto]` | `[secreto]` | URL Keycloak (se provider=keycloak) |
| `KEYCLOAK_REALM` | — | `[secreto]` | `[secreto]` | Realm Keycloak |
| `LOG_LEVEL` | `debug` | `info` | `warn` | Nível logging Winston |
| `UPLOAD_MAX_SIZE` | `25mb` | `25mb` | `25mb` | Tamanho máximo upload evidências |

> ⚠️ **NUNCA** commitar valores reais de staging/produção. Usar secrets manager ou variáveis injetadas pelo pipeline.

---

## 5. Estratégia de Deploy

### Dev
- **Gatilho:** push na branch `develop`
- **Pipeline:** lint → type-check → testes unitários → build → deploy
- **Rollback:** `git revert` + push

### Staging
- **Gatilho:** criação de branch `release/*` + aprovação manual
- **Pipeline:** dev gates + testes E2E → build → deploy
- **Validação:** smoke tests + aprovação Auditor-Chefe
- **Rollback:** reverter tag de release

### Produção
- **Gatilho:** tag semver (`v1.0.0`) + aprovação de 2 revisores
- **Pipeline:** staging gates + security scan → deploy
- **Rollback:** `docker compose up -d` com tag anterior. Tempo máximo: 5 minutos.

---

## 6. Estratégia de Rollback

| Cenário | Ação | Tempo Máximo |
|---------|------|-------------|
| Erro crítico pós-deploy | Reverter para tag anterior | 5 min |
| Degradação de performance | Rollback imediato | 5 min |
| Dados corrompidos | Restaurar backup + reverter deploy | 30 min |

**Comando de rollback:**
```bash
# Listar tags disponíveis
git tag -l 'v*'

# Rollback para versão anterior
git checkout v1.0.0
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 7. Backup e Restore

| Item | Frequência | Retenção | Comando |
|------|-----------|----------|---------|
| Banco (incremental) | Diário (00:00) | 30 dias | `pg_dump -Fc` |
| Banco (completo) | Semanal (domingo) | 12 meses | `pg_dump -Fc` |
| Arquivos (evidências) | Diário | 10 anos (CNJ 309) | `rsync` |

**Restore:**
```bash
pg_restore -d conformitas_prod backup_2026-06-16.dump
```

---

## 8. Monitoramento Pós-Deploy

- **Health check:** `GET /api/v1/health` — verificado a cada 30s por 5 min
- **Métricas:** latency p95, error rate, CPU, memória, disco
- **Alertas:**
  - Error rate > 1% nos primeiros 5 min → alerta crítico
  - Latency p95 > 2x baseline → alerta
  - Health check falha 3x → notificação infra TJCE
  - Espaço em disco < 20% → alerta (evidências)
- **Ferramentas:** Logs via Winston (arquivo), métricas via Prometheus (opcional)

---

## 9. Comandos de Deploy

```bash
# Deploy Dev (automático via CI)
git push origin develop

# Deploy Staging
git checkout -b release/v1.0.0
git push origin release/v1.0.0
# Aprovar no GitHub Actions dashboard

# Deploy Produção
git tag v1.0.0
git push origin v1.0.0
# Aprovar no GitHub Actions (requer 2 revisores)
```

---

## 10. Checklist de Deploy

- [ ] Todos os testes passam no ambiente alvo
- [ ] Cobertura ≥ threshold definido (80% unitários, 70% integração)
- [ ] Security scan sem vulnerabilidades críticas (CVSS ≥ 9.0)
- [ ] Variáveis de ambiente verificadas e injetadas
- [ ] Health check `GET /api/v1/health` responde 200
- [ ] Smoke tests manuais passam (login P01, abrir PAA, criar auditoria)
- [ ] Rollback testado nos últimos 30 dias
- [ ] Backup realizado antes do deploy de produção
- [ ] Comunicação prévia ao TJCE (janela de manutenção se necessário)

---

**Versão:** 1.0 | **Data:** 2026-06-16
