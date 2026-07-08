# ADR-0001: Angular + NestJS Fullstack TypeScript

**Status**: Aprovado
**Data**: 2026-06-16

## Contexto
O TJCE padronizou Angular como framework frontend institucional. A equipe de desenvolvimento tem proficiência em TypeScript.

## Decisão
Adotar Angular no frontend e NestJS/TypeScript no backend. Stack unificada em linguagem.

## Alternativas Consideradas
- React + NestJS: Frontend em React não atende ao padrão institucional TJCE
- Python/Django + Angular: Stack separado, overhead de contexto entre times

## Consequências
- Stack TypeScript ponta a ponta reduz barreira entre front e back
- Angular oferece estrutura opinativa adequada para 15 módulos corporativos
- Compartilhamento de tipos entre frontend e backend
