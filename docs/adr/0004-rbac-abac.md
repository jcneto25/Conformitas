# ADR-0004: RBAC + Políticas ABAC

**Status**: Aprovado
**Data**: 2026-06-16

## Contexto
CNJ 308/309 exigem segregação de funções (SoD) e controle de acesso por sigilo. 10 perfis institucionais com escopos diferentes.

## Decisão
RBAC com 10 perfis predefinidos + políticas ABAC para restrições contextuais (unidade, sigilo).

## Alternativas Consideradas
- RBAC puro: Não cobre escopo por unidade (P05 só vê própria unidade)
- ABAC puro: Mais complexo de configurar e auditar

## Consequências
- 10 perfis (P01-P10) com matriz CRUD definida
- ABAC granular via ClassificacaoGuard (nível de sigilo do documento)
- Escopo de unidade para P05/P06 (filtro automático em queries)
- Regras SoD: P01 não acumula, P10 sem dados de auditoria
