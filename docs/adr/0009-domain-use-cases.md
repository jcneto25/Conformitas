# ADR-0009: Domain Entities + Use Cases

**Status**: Aprovado
**Data**: 2026-07-08

## Contexto
Regras de negócio misturadas com chamadas de ORM nos services. Violação de SRP (múltiplas responsabilidades por classe) e ausência de camada de domínio pura.

## Decisão
Extrair entidades de domínio puras (sem dependências de framework/ORM) e casos de uso focados (um por operação de negócio) para os módulos auditorias e achados.

## Alternativas Consideradas
- Extrair use cases para todos os 23 módulos: Esforço alto para CRUD puro
- Manter tudo no service: Perpetua a mistura de responsabilidades

## Consequências
- Entidades de domínio com validações de transição de estado (status machine)
- 8 use cases criados (4 auditorias + 4 achados)
- Services mantidos como facade para CRUD e consultas
- Domínio com zero dependências de infraestrutura
