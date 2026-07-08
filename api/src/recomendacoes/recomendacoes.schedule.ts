import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VerificarVencidasUseCase } from './use-cases/verificar-vencidas.use-case';
import { EscalarVencidasUseCase } from './use-cases/escalar-vencidas.use-case';

@Injectable()
export class RecomendacoesSchedule {
  private readonly logger = new Logger(RecomendacoesSchedule.name);

  constructor(
    private readonly verificarUseCase: VerificarVencidasUseCase,
    private readonly escalarUseCase: EscalarVencidasUseCase,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async verificarVencidas() {
    const result = await this.verificarUseCase.execute();
    if (result.vencidas > 0) {
      this.logger.warn(`${result.vencidas} recomendação(ões) vencida(s).`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async escalarVencidas() {
    const result = await this.escalarUseCase.execute();
    if (result.escaladas > 0) {
      this.logger.warn(`${result.escaladas} recomendação(ões) VENCIDA(s) há +30 dias — revisar escalonamento.`);
    }
  }
}
