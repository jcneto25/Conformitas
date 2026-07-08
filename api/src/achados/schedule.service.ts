import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConsolidarAchadoUseCase } from './use-cases/consolidar-achado.use-case';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private readonly consolidarUseCase: ConsolidarAchadoUseCase) {}

  @Cron(CronExpression.EVERY_HOUR)
  async consolidarAchadosExpirados() {
    this.logger.log('Verificando achados com prazo de manifestação expirado...');
    const result = await this.consolidarUseCase.consolidarExpirados();
    if (result.consolidados > 0) {
      this.logger.log(`Consolidados ${result.consolidados} achados por expiração de prazo`);
    }
  }
}
