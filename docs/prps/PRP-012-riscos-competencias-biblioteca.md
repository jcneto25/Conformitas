# PRP-012 — Gestão de Riscos, Competências e Biblioteca

> **ID:** PRP-012 | **Onda:** 3 | **Estimativa:** 6 dias | **Status:** ⏳ Pending
> **Prioridade:** Média | **Complexidade:** Média | **Módulos:** MOD-RIS-001, MOD-CAP-001, MOD-BIB-001
> **Depende de:** PRP-001, PRP-002 | **Criado em:** 2026-06-16 | **Versão:** 1.0

---

## 1. Contexto e Objetivo

Este PRP entrega três módulos auxiliares: Gestão de Riscos da AUDIN (ISO 31000), Plano Anual de Capacitação (PAC-Aud) e Biblioteca Metodológica.

- [ ] Gestão de riscos: contexto, identificação, matriz probabilidade × impacto, tratamento
- [ ] PAC-Aud: competências, lacunas, capacitações, controle de 40h/ano
- [ ] Biblioteca: catálogo de normas, manuais, templates com versionamento

---

## 2. Requisitos Funcionais (Amostra)

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-012.1 | Cadastrar risco | **Dado** que P01 acessa riscos, **Quando** cadastra risco com causa, evento, consequência, probabilidade 3 e impacto 4, **Então** nível é calculado ALTO | Should |
| RF-012.2 | Registrar capacitação | **Dado** que P02 concluiu curso de 20h, **Quando** P01 registra com certificado, **Então** horas são contabilizadas no total anual | Should |
| RF-012.3 | Alerta meta 40h | **Dado** que P02 tem apenas 15h em outubro, **Quando** P02 acessa, **Então** alerta "Meta de 40h/ano: faltam 25h" | Should |
| RF-012.4 | Upload de documento metodológico | **Dado** que P01 acessa biblioteca, **Quando** faz upload de "Manual de Auditoria v2.0", **Então** documento é versionado e disponível para consulta | Could |

---

## 3. Database Changes (Resumo)

- `riscos`: id, codigo, descricao, categoria, causa, evento, consequencia, probabilidade, impacto, nivel, estrategia, plano_acao, status
- `competencias`: id, nome, tipo (TECNICA/GERENCIAL), area_auditoria
- `capacitacoes`: id, titulo, instituicao, carga_horaria, tipo, data_inicio, data_fim, participante_ids, certificado_path
- `documentos_metodologicos`: id, titulo, tipo (NORMA/MANUAL/TEMPLATE/CHECKLIST), categoria, versao, arquivo_path, vigencia_inicio, vigencia_fim, status

---

## 4. Definition of Done

- [ ] Matriz de riscos com 5 níveis
- [ ] PAC-Aud com alerta de meta 40h
- [ ] Biblioteca com versionamento
- [ ] Cobertura ≥ 80%
- [ ] PR revisado
