# ADR-0003: PostgreSQL

**Status**: Aprovado
**Data**: 2026-06-16

## Contexto
Dados estruturados de auditoria com necessidade de ACID. JSONB para campos flexíveis (equipe_ids, questoes_auditoria). Deploy on-premises sem dependência de cloud.

## Decisão
PostgreSQL como banco relacional único.

## Alternativas Consideradas
- MongoDB: Menos adequado para dados relacionais de auditoria
- MySQL: Menos features de JSONB e índices

## Consequências
- Suporte nativo a JSONB para dados flexíveis
- ACID completo para transações de auditoria
- Índices parciais e expressivos
- On-premises sem dependência externa
