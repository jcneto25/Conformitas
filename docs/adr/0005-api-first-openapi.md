# ADR-0005: API-First com OpenAPI

**Status**: Aprovado
**Data**: 2026-06-16

## Contexto
15+ módulos desenvolvidos em 4 ondas. Necessidade de contratos estáveis entre frontend e backend para desenvolvimento paralelo.

## Decisão
Todos os módulos expõem APIs REST documentadas em OpenAPI 3.x (Swagger). Frontend consome exclusivamente via API.

## Alternativas Consideradas
- GraphQL: Overkill para domínio de auditoria com consultas previsíveis
- RPC: Menos interoperável e auto-documentável

## Consequências
- Contratos estáveis entre frontend e backend
- Documentação gerada automaticamente (@nestjs/swagger)
- Possibilidade de geração de client HTTP
- Versionamento de API simplificado
