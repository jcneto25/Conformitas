import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RecomendacoesService } from './recomendacoes.service';

// RF-008.4 / RF-008.5 — alertas de vencimento e escalonamento periódico.
@Injectable()
export class RecomendacoesSchedule {
  private readonly logger = new Logger(RecomendacoesSchedule.name);

  constructor(private readonly service: RecomendacoesService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async verificarVencidas() {
    const result = await this.service.verificarVencidas();
    if (result.vencidas > 0) {
      this.logger.warn(
        `${result.vencidas} recomendação(ões) vencida(s). Notificar: ${result.notificados.join(', ')}`,
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async escalarVencidas() {
    const result = await this.service.escalarVencidas();
    if (result.escaladas > 0) {
      this.logger.warn(
        `${result.escaladas} recomendação(ões) VENCIDA(s) há +30 dias — escalonar a ${result.notificar.join(', ')}`,
      );
    }
  }
}
