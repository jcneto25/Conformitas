# ADR-0010: Event Bus com @nestjs/event-emitter

**Status**: Aprovado
**Data**: 2026-07-08

## Contexto
Use cases e services de auditorias e achados chamavam NotificacoesService diretamente — acoplamento síncrono entre módulos de domínio distintos. NotificacoesModule era @Global(), mascarando o acoplamento.

## Decisão
Substituir chamadas diretas a NotificacoesService por eventos de domínio emitidos via @nestjs/event-emitter. Um handler em notificacoes/ escuta os eventos e delega ao service.

## Alternativas Consideradas
- RabbitMQ/NATS: Overkill para monólito, latência de rede desnecessária
- EventEmitter customizado: @nestjs/event-emitter já é a solução nativa do framework

## Consequências
- 8 pontos de acoplamento direto removidos
- Use cases/serviços não conhecem mais o módulo de notificações
- Eventos in-process com zero latência de rede
- 4 classes de evento de domínio criadas
- Handler único em notificacoes/ com 4 métodos @OnEvent
