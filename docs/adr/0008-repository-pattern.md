# ADR-0008: Repository Pattern

**Status**: Aprovado
**Data**: 2026-07-08

## Contexto
Services injetavam PrismaService diretamente — dependência concreta de infraestrutura acoplada à lógica de negócio. Violava o DIP (Clean Architecture) e Ports & Adapters (DDD). Qualquer troca de ORM exigiria reescrever todos os services.

## Decisão
Cada módulo passou a ter uma interface de repositório + implementação Prisma. Services injetam a interface via token string com `@Inject()`.

## Alternativas Consideradas
- Classe abstrata com herança: Acoplamento mais forte que interface
- Repositório genérico (CRUD base): Perde tipagem por módulo

## Consequências
- DIP corrigido: dependências apontam para abstrações
- Trocar ORM vira adicionar nova implementação (ex: `TypeOrmAuditoriaRepository`)
- 32 interfaces + 32 implementações criadas
- Testes: mock do token em vez de mock do PrismaService
