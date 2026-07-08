import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificacoesService } from '../notificacoes.service';
import {
  AuditoriaAbertaEvent, AuditoriaSuspensaEvent, AchadoManifestacaoEvent, ManifestacaoRegistradaEvent,
} from '../../shared/events/auditoria-events';

@Injectable()
export class NotificacaoEventHandler {
  private readonly logger = new Logger(NotificacaoEventHandler.name);

  constructor(private readonly notificacoes: NotificacoesService) {}

  @OnEvent('auditoria.aberta')
  async handleAuditoriaAberta(event: AuditoriaAbertaEvent) {
    this.logger.debug(`Evento: auditoria ${event.numero} aberta`);
    await this.notificacoes.notificarGestoresUnidade({
      unidade: event.unidadeAuditada, tipo: 'AUDITORIA_ABERTA',
      mensagem: `Nova auditoria ${event.numero} aberta para sua unidade.`,
      auditoriaId: event.aggregateId,
    });
  }

  @OnEvent('auditoria.suspensa')
  async handleAuditoriaSuspensa(event: AuditoriaSuspensaEvent) {
    this.logger.debug(`Evento: auditoria ${event.numero} suspensa`);
    await this.notificacoes.notificarPorPerfil({
      codigoPerfil: 'P01', tipo: 'AUDITORIA_SUSPENSA',
      mensagem: `Auditoria ${event.numero} foi suspensa. Motivo: ${event.motivo}`,
      auditoriaId: event.aggregateId,
    });
    await this.notificacoes.notificarPorPerfil({
      codigoPerfil: 'P03', tipo: 'AUDITORIA_SUSPENSA',
      mensagem: `Auditoria ${event.numero} foi suspensa. Motivo: ${event.motivo}`,
      auditoriaId: event.aggregateId,
    });
  }

  @OnEvent('achado.manifestacao')
  async handleAchadoManifestacao(event: AchadoManifestacaoEvent) {
    this.logger.debug(`Evento: achado ${event.codigo} enviado para manifestação`);
    await this.notificacoes.notificarGestoresUnidade({
      unidade: event.unidadeAuditada, tipo: 'ACHADO_MANIFESTACAO',
      mensagem: `Achado ${event.codigo} enviado para manifestação. Prazo: ${event.prazoDias} dias úteis.`,
      auditoriaId: event.auditoriaId,
    });
  }

  @OnEvent('achado.manifestacao.registrada')
  async handleManifestacaoRegistrada(event: ManifestacaoRegistradaEvent) {
    this.logger.debug(`Evento: manifestação registrada para achado ${event.codigo}`);
    await this.notificacoes.notificarPorPerfil({
      codigoPerfil: 'P02', tipo: 'MANIFESTACAO_REGISTRADA',
      mensagem: `Manifestação registrada para o achado ${event.codigo}`,
      auditoriaId: event.auditoriaId,
    });
  }
}
