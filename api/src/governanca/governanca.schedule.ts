import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GovernancaService } from './governanca.service';

@Injectable()
export class GovernancaSchedule {
  private readonly logger = new Logger(GovernancaSchedule.name);

  constructor(private readonly governancaService: GovernancaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async verificarFraudes60Dias() {
    this.logger.log('Verificando registros de fraude com 60+ dias sem comunicação ao TCE...');
    const result = await this.governancaService.verificarFraudes60Dias();
    if (result.pendentes > 0) {
      this.logger.warn(
        `${result.pendentes} registro(s) de fraude com 60+ dias sem comunicação ao TCE. ` +
          `IDs: ${result.registros.map((r) => r.id).join(', ')}`,
      );
    } else {
      this.logger.log('Nenhum registro de fraude pendente de comunicação ao TCE.');
    }
  }
}
