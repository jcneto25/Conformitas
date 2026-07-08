# ADR-0007: Docker Compose

**Status**: Aprovado
**Data**: 2026-06-16

## Contexto
Infraestrutura do TJCE suporta Docker. O sistema tem 4 containers (web, api, db, redis).

## Decisão
Docker Compose para orquestração on-premises. Sem Kubernetes no MVP.

## Alternativas Consideradas
- Kubernetes: Complexidade desnecessária para 4 containers
- VMs diretas: Menos reprodutibilidade e portabilidade

## Consequências
- Setup local reproduzível com `docker compose up`
- CI/CD com mesmo ambiente de produção
- Migração futura para Kubernetes possível sem refatoração dos containers
- Limitação a um único host (sem orquestração multi-host)
