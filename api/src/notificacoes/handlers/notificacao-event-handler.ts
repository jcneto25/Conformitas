import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificacoesService } from '../notificacoes.service';
import {
  AuditoriaAbertaEvent,
  AuditoriaSuspensaEvent,
  AchadoManifestacaoEvent,
  ManifestacaoRegistradaEvent,
} from '../../shared/events/auditoria-events';

@Injectable()
export class NotificacaoEventHandler {
  private readonly logger = new Logger(NotificacaoEventHandler.name);

  constructor(private readonly notificacoes: NotificacoesService) {}

  @OnEvent('auditoria.aberta')
  async handleAuditoriaAberta(event: AuditoriaAbertaEvent) {
    this.logger.debug(`Evento: auditoria ${event.numero} aberta`);
    await this.notificacoes.notificarGestoresUnidade(
      event.unidadeAuditada,
      'AUDITORIA_ABERTA',
      `Nova auditoria ${event.numero} aberta para sua unidade.`,
      event.aggregateId,
    );
  }

  @OnEvent('auditoria.suspensa')
  async handleAuditoriaSuspensa(event: AuditoriaSuspensaEvent) {
    this.logger.debug(`Evento: auditoria ${event.numero} suspensa`);
    await this.notificacoes.notificarPorPerfil(
      'P01',
      'AUDITORIA_SUSPENSA',
      `Auditoria ${event.numero} foi suspensa. Motivo: ${event.motivo}`,
      event.aggregateId,
    );
    await this.notificacoes.notificarPorPerfil(
      'P03',
      'AUDITORIA_SUSPENSA',
      `Auditoria ${event.numero} foi suspensa. Motivo: ${event.motivo}`,
      event.aggregateId,
    );
  }

  @OnEvent('achado.manifestacao')
  async handleAchadoManifestacao(event: AchadoManifestacaoEvent) {
    this.logger.debug(`Evento: achado ${event.codigo} enviado para manifestação`);
    await this.notificacoes.notificarGestoresUnidade(
      event.unidadeAuditada,
      'ACHADO_MANIFESTACAO',
      `Achado ${event.codigo} enviado para manifestação. Prazo: ${event.prazoDias} dias úteis.`,
      event.auditoriaId,
    );
  }

  @OnEvent('achado.manifestacao.registrada')
  async handleManifestacaoRegistrada(event: ManifestacaoRegistradaEvent) {
    this.logger.debug(`Evento: manifestação registrada para achado ${event.codigo}`);
    await this.notificacoes.notificarPorPerfil(
      'P02',
      'MANIFESTACAO_REGISTRADA',
      `Manifestação registrada para o achado ${event.codigo}`,
      event.auditoriaId,
    );
  }
}
