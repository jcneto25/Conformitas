# Plano de Entregas — CONFORMITAS 3.0

> **Versão:** 1.0 | **Data:** 2026-06-16 | **Status:** Gerado (Step 4)
> **Projeto:** CONFORMITAS 3.0 | **Codename:** SGI
> **Autor:** IA (Step 4) | **Referências:** PRD, SPEC, 14 PRPs, DEPENDENCY_MATRIX

---

## 1. Visão Geral do Plano

Este plano cobre o desenvolvimento completo do CONFORMITAS 3.0 em 4 ondas de execução, abrangendo 15 módulos funcionais decompostos em 14 PRPs. O plano serve ao time de desenvolvimento e stakeholders da AUDIN/TJCE. Metodologia: **PRP-Based Development** com execução paralela onde as dependências permitirem. Horizonte: MVP com todos os módulos Must, estendendo-se a Should/Could nas ondas 3 e 4.

### 1.1 Metodologia

| Aspecto | Definição |
|---------|-----------|
| Framework | PRP-Based Development (contratos auto-contidos) |
| Ciclo | Ondas de 1-3 semanas (não sprints rígidos) |
| Priorização | Dependências técnicas × Valor de negócio (Must → Should → Could) |
| DoD | Checklist por PRP (seção 12 de cada PRP) |

---

## 2. Roadmap e Marcos

### Onda 1: Fundação e Core (Must) — 22 dias com 3 devs

**Objetivo:** Plataforma funcional com autenticação, RBAC, planejamento, execução de auditorias e achados. Usuário pode logar, criar PAA, abrir auditoria, registrar evidências e achados.

**PRPs:** 001, 002, 003, 004, 005, 006, 009

| # | Deliverable | Critério de aceitação |
|---|-------------|----------------------|
| 1 | Login e MFA funcionais | Auditor loga com senha+TOTP, sessão expira em 30 min |
| 2 | 10 perfis com RBAC | P01 vê tudo, P05 vê só sua unidade, P10 não vê dados de auditoria |
| 3 | Universo auditável com matriz de priorização | Cadastro de áreas com notas, matriz ordenada por índice |
| 4 | PALP e PAA com workflow de aprovação | P01 submete, P03 aprova, bloqueio por excesso de horas |
| 5 | Abertura e execução de auditoria | Comunicado gerado, upload de evidências, papéis de trabalho |
| 6 | Achados com 4 atributos e manifestações | Registro de achado, envio à unidade, prazo de 5 dias |
| 7 | Declaração de independência e classificação de sigilo | P02 declara independência, P01 classifica documento SIGILOSO |

### Onda 2: Relatórios e Monitoramento (Must) — 8 dias

**Objetivo:** Emissão de relatórios de auditoria, recomendações e monitoramento de implementação.

**PRPs:** 007, 008, 010

| # | Deliverable | Critério de aceitação |
|---|-------------|----------------------|
| 8 | Relatório Preliminar e Final | Compilação de achados, geração de relatório, assinatura P01 |
| 9 | Recomendações com monitoramento | Emissão, workflow Pendente→Cumprida, alertas de vencimento |
| 10 | Consultorias | Solicitação por P05, aceitação por P01, termo anticogestão |

### Onda 3: Qualidade e Governança (Should) — 8 dias

**Objetivo:** PQAUD, gestão de riscos, capacitação, biblioteca, governança e transparência.

**PRPs:** 011, 012, 013

| # | Deliverable | Critério de aceitação |
|---|-------------|----------------------|
| 11 | PQAUD funcional | Autoavaliações, não conformidades, acesso P07 temporário |
| 12 | Gestão de riscos, PAC-Aud e biblioteca | Matriz de riscos, meta 40h, catálogo de normas |
| 13 | Governança e fraudes | Registro de determinações TCE/CNJ, workflow de fraude |

### Onda 4: Dashboards e Integrações (Should/Could) — 7 dias

**Objetivo:** Visibilidade gerencial e integração com sistemas externos.

**PRPs:** 014

| # | Deliverable | Critério de aceitação |
|---|-------------|----------------------|
| 14 | Dashboards e integrações | 5 dashboards, export PDF/XLSX, catálogo de integrações, Ações Coordenadas SIAUD-Jud |

---

## 3. Master PRP List

| PRP | Nome | Onda | Dias | Complexidade | Prioridade | Dependências |
|-----|------|------|------|--------------|------------|-------------|
| 001 | Autenticação e Usuários | 1 | 8 | Alta | Crítico | — |
| 002 | Perfis, RBAC e Configurações | 1 | 5 | Média | Crítico | 001 |
| 003 | Universo Auditável e Matriz | 1 | 6 | Média | Alto | 001, 002 |
| 004 | PALP, PAA e Força de Trabalho | 1 | 8 | Alta | Alto | 001, 002, 003 |
| 005 | Auditorias, Evidências e Papéis | 1 | 8 | Alta | Crítico | 001, 002, 004 |
| 006 | Achados e Manifestações | 1 | 5 | Média | Crítico | 001, 002, 005 |
| 009 | Ética, Sigilo e Impedimentos | 1 | 4 | Baixa | Alto | 001, 002 |
| 007 | Relatórios de Auditoria | 2 | 6 | Média | Alto | 001, 002, 006 |
| 008 | Recomendações e Monitoramento | 2 | 6 | Média | Alto | 001, 002, 007 |
| 010 | Consultorias e Assessoramento | 2 | 4 | Baixa | Média | 001, 002, 004 |
| 011 | Qualidade e PQAUD | 3 | 5 | Média | Média | 001, 002, 005, 007 |
| 012 | Riscos, Competências e Biblioteca | 3 | 6 | Média | Média | 001, 002 |
| 013 | Governança e Fraudes | 3 | 4 | Baixa | Média | 001, 002, 007, 008 |
| 014 | Dashboards, BI e Integrações | 4 | 7 | Média | Média | 001, 002, 004, 005, 008 |

---

## 4. Estimativas e Capacidade

| Métrica | Valor |
|---------|-------|
| PRPs totais | 14 |
| Dias total (sequencial) | 74 |
| Dias total (paralelo — 3 devs) | ~45 |
| Dias com folga 20% | ~54 |
| Semanas (~5 dias/semana) | ~11 semanas |
| **Previsão de conclusão (MVP)** | ~3 meses com 3 devs |

---

## 5. Estratégia de Ambientes e Deploy

| Ambiente | Finalidade | Atualização |
|----------|------------|-------------|
| Desenvolvimento | Desenvolvimento ativo por PRP | Contínua (por branch) |
| Homologação (Staging) | Validação ao final de cada onda | Ao fim de cada onda |
| Produção | TJCE — AUDIN | Após Onda 4 + testes de aceite |

---

## 6. Definição de Pronto do Projeto (DoD Global)

- [ ] Todos os 14 PRPs com DoD individual aprovado
- [ ] Cobertura de testes ≥ 80% unitários, ≥ 70% integração
- [ ] Testes E2E para fluxos críticos passando
- [ ] Deploy em staging validado
- [ ] Documentação de API (OpenAPI) completa
- [ ] Manual do usuário gerado (Step 10.5)
- [ ] Security audit aprovado (SCA + SAST + Secrets)
- [ ] OWASP Top 10 verificado
- [ ] Null safety validado
- [ ] Aceite do stakeholder (AUDIN)

---

**Versão:** 1.0 | **Data:** 2026-06-16
