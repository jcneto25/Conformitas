# ADR-0002: NestJS para Backend

**Status**: Aprovado
**Data**: 2026-06-16

## Contexto
O sistema tem 15+ módulos com interdependências. É necessário um framework que ofereça injeção de dependência, módulos e guards nativos para implementar RBAC.

## Decisão
NestJS como framework backend.

## Alternativas Consideradas
- Express: Menos estruturado para 15+ módulos, sem DI nativo
- Fastify: Menos ecossistema de guards/auth

## Consequências
- DI + módulos + guards nativos reduzem boilerplate de segurança
- Ecossistema maduro (@nestjs/jwt, @nestjs/passport, @nestjs/throttler)
- Curva de aprendizado para novos membros da equipe
