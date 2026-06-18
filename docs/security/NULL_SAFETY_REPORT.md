# Relatório de Null Safety — PRPs

| Campo | Valor |
|---|---|
| **Data da validação** | 2026-06-16 |
| **PRPs analisados** | PRP-001 a PRP-014 (14/14) |
| **Total de entidades** | 37 tabelas |
| **Total de campos** | ~280 campos |
| **Decisão** | ⚠️ APROVADO COM RESSALVAS |

---

## 1. Sumário

- ✅ Campos com nulabilidade explícita: 6
- ⚪ Campos sem especificação explícita (formato PRP não inclui coluna "Nulável"): ~274
- 🟡 Campos nuláveis com fallback documentado (via API contracts): 3
- 🟡 Campos nuláveis sem fallback: 3
- 🟡 Inconsistências entre PRPs: 0
- 🟢 Divergências com DATA_MODEL.md: N/A (DATA_MODEL.md não existe)

---

## 2. Contexto da Análise

Os PRPs definem modelos de dados na seção "Database Changes" usando formato tabular:

```
| Operação | Tabela | Campos | Índice | Sensível |
```

O formato **não inclui coluna "Nulável"** — os campos são listados com tipo entre parênteses (ex: `id (UUID PK)`, `usuario_id (FK nullable)`). Apenas 5 campos trazem a anotação explícita `nullable` nos FKs, e 1 campo traz `null` via API contract.

**Conclusão:** Os PRPs não foram desenhados para declarar nulabilidade sistematicamente. Essa definição cabe ao schema Prisma, que será criado na Onda 0 (Setup) a partir dos PRPs como requisitos.

---

## 3. Inventário de Campos com Nulabilidade Explícita

| PRP | Entidade | Campo | Tipo | Nulável? | Fallback | Status |
|---|---|---|---|---|---|---|
| PRP-002 | `logs_sistema` | `usuario_id` | FK | SIM (anotado `nullable`) | `null` (ações sem usuário) | ✅ OK |
| PRP-008 | `recomendacoes` | `achado_id` | FK | SIM (anotado `nullable`) | `null` (recomendação sem achado vinculado) | ✅ OK |
| PRP-010 | `consultorias` | `solicitacao_id` | FK | SIM (anotado `nullable`) | `null` (consultoria espontânea) | ✅ OK |
| PRP-013 | `registros_fraude` | `auditoria_id` | FK | SIM (anotado `nullable`) | NÃO DOCUMENTADO | 🟡 |
| PRP-014 | `acoes_coordenadas` | `auditoria_id` | FK | SIM (anotado `nullable`) | NÃO DOCUMENTADO | 🟡 |
| PRP-008 | `providencias` | `evidencia_path` | `string\|null` | SIM (via API contract) | `null` (providência sem evidência anexada) | ✅ OK |

---

## 4. Campos com Nulabilidade via API Contract (Inferida)

Campos onde a nulabilidade pode ser inferida dos API contracts, mas **não está declarada** no modelo de dados do PRP:

| PRP | Endpoint | Campo | Tipo no Request | Nulável? |
|---|---|---|---|---|
| PRP-002 | POST /usuarios/{id}/perfis | `unidade_escopo` | `string\|null` | SIM (API) |
| PRP-002 | POST /usuarios/{id}/perfis | `data_fim` | `date\|null` | SIM (API) |
| PRP-008 | POST /recomendacoes | `achado_id` | `uuid\|null` | SIM (API) |

---

## 5. Campos Notáveis com Nulabilidade Implícita (Por Domínio)

Campos que, por regra de negócio, são claramente opcionais mas não têm anotação explícita:

| PRP | Entidade | Campo | Razão da Nulabilidade Implícita |
|---|---|---|---|
| PRP-001 | `usuarios` | `data_desativacao` | Só preenchido se `ativo = false` |
| PRP-001 | `usuarios` | `bloqueado_ate` | Só preenchido após 5 tentativas |
| PRP-001 | `usuarios` | `mfa_secret` | Só gerado se `mfa_enabled = true` |
| PRP-004 | `planos_auditoria` | `data_submissao` | Só preenchido quando status ≥ SUBMETIDO |
| PRP-004 | `planos_auditoria` | `data_aprovacao` | Só preenchido quando status ≥ APROVADO |
| PRP-004 | `planos_auditoria` | `data_publicacao` | Só preenchido quando status = PUBLICADO |
| PRP-005 | `auditorias` | `data_fim_real` | Só preenchido quando concluída |
| PRP-005 | `requisicoes` | `data_resposta` | Só preenchido quando respondida |
| PRP-006 | `achados_auditoria` | `data_consolidacao` | Só preenchido quando status = CONSOLIDADO |
| PRP-007 | `relatorios_auditoria` | `assinado_por` | Só preenchido quando assinado |
| PRP-007 | `relatorios_anuais` | `data_envio` | Só preenchido quando enviado |
| PRP-007 | `relatorios_anuais` | `data_publicacao` | Só preenchido quando publicado |
| PRP-009 | `impedimentos` | `auditoria_id` | Impedimento genérico vs. específico |

---

## 6. Problemas Encontrados

### 6.1 Campos sem Especificação de Nulabilidade (⚪ Sistêmico)

**Status:** O formato dos PRPs não inclui coluna de nulabilidade. Aproximadamente 274 dos ~280 campos não têm declaração explícita de nullable/required.

**Recomendação:** A nulabilidade será definida no schema Prisma durante a Onda 0 (Setup), derivada das regras de negócio dos PRPs. Neste momento, não é um bloqueio — é uma lacuna esperada do formato PRP.

### 6.2 Campos Nuláveis sem Fallback (🟡 Alto)

✅ **Nenhum.** Os 3 campos identificados foram documentados nos PRPs 002, 013 e 014 (ver seção 8).

### 6.3 Inconsistências entre PRPs (🟡 Alto)

Nenhuma inconsistência encontrada. Os campos compartilhados entre PRPs (ex: `usuario_id`, `auditoria_id`) mantêm a mesma semântica.

### 6.4 Divergências com DATA_MODEL.md (🟢 Médio)

N/A — `docs/architecture/DATA_MODEL.md` não existe. Este artefato é gerado pelo Step 5 ou criado na Onda 0.

---

## 7. Decisão do Gate

**Decisão:** ✅ **APROVADO**

### Critérios
- [x] 0 inconsistências entre PRPs
- [⚠️] ~274 campos sem especificação de nulabilidade (esperado — formato PRP não inclui coluna)
- [⚠️] 3 campos nuláveis com fallback documentado; 3 sem fallback explícito
- [x] Nenhum campo crítico com ambiguidade de nulabilidade que bloqueie implementação

### Bloqueios

Nenhum bloqueio. A nulabilidade será definida no schema Prisma durante a implementação.

### Recomendações

1. **Na Onda 0 (Setup):** Ao criar o schema Prisma, definir nulabilidade explicitamente para todos os campos, usando as regras de negócio dos PRPs como guia.
2. **Campos com nulabilidade por estado:** Campos como `data_submissao`, `data_aprovacao`, `data_publicacao` são nulos até que o workflow avance — tratar como `DateTime?` no Prisma.
3. ~~3 campos sem fallback~~ → **Corrigidos** (ver seção 8).
4. **FKs críticas:** `criado_por`, `autor_id`, `assinado_por`, `responsavel_id` — todas devem ser `NÃO NULAS` quando a entidade é criada (validar no Prisma).
5. **Criar `DATA_MODEL.md`** como artefato canônico após a primeira migration do Prisma, consolidando nulabilidade de todas as entidades.
6. **Template de PRP atualizado** — a subseção 7.2 (`Especificação de Campos por Tabela`) agora inclui colunas `Obrigatório` (✅/❌) e `Fallback`, permitindo verificação automatizada de null safety no Step 12.

---

## 8. Correções Aplicadas (2026-06-16)

| PRP | Campo | Fallback documentado |
|-----|-------|---------------------|
| PRP-002 | `usuarios_perfis.data_fim` | `null` = perfil vitalício / sem data de expiração (ex: P02, P10). Preenchido apenas para mandatos temporários (P01, P07). |
| PRP-013 | `registros_fraude.auditoria_id` | `null` = origem externa à auditoria (denúncia da Ouvidoria, comunicação espontânea). |
| PRP-014 | `acoes_coordenadas.auditoria_id` | `null` = ação recebida do SIAUD-Jud antes da auditoria local ser aberta. Vinculada posteriormente. |

Além disso, o template `docs/prps/PRP_TEMPLATE.md` foi atualizado com a subseção 7.2 (`Especificação de Campos por Tabela`) que inclui colunas `Obrigatório` e `Fallback`, eliminando a lacuna de nulabilidade para futuros PRPs.

---

**Versão:** 1.0 | **Data:** 2026-06-16
do as regras de negócio dos PRPs como guia.
2. **Campos com nulabilidade por estado:** Campos como `data_submissao`, `data_aprovacao`, `data_publicacao` são nulos até que o workflow avance — tratar como `DateTime?` no Prisma.
3. **3 campos sem fallback:** Documentar o fallback na seção `data_model` dos PRPs 013 e 014 antes da implementação dos respectivos PRPs.
4. **FKs críticas:** `criado_por`, `autor_id`, `assinado_por`, `responsavel_id` — todas devem ser `NÃO NULAS` quando a entidade é criada (validar no Prisma).
5. **Criar `DATA_MODEL.md`** como artefato canônico após a primeira migration do Prisma, consolidando nulabilidade de todas as entidades.

---

**Versão:** 1.0 | **Data:** 2026-06-16
s as entidades.

---

**Versão:** 1.0 | **Data:** 2026-06-16
