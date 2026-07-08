import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { GovernancaService } from './governanca.service';
import { GovernancaController } from './governanca.controller';
import { PrismaDeterminacaoRepository } from './repositories/prisma-determinacao.repository';
import { PrismaRegistroFraudeRepository } from './repositories/prisma-registro-fraude.repository';
import { DETERMINACAO_REPOSITORY } from './repositories/determinacao.repository';
import { REGISTRO_FRAUDE_REPOSITORY } from './repositories/registro-fraude.repository';
@Module({
  imports: [PrismaModule, ScheduleModule],
  controllers: [GovernancaController],
  providers: [
    GovernancaService,
    { provide: DETERMINACAO_REPOSITORY, useClass: PrismaDeterminacaoRepository },
    { provide: REGISTRO_FRAUDE_REPOSITORY, useClass: PrismaRegistroFraudeRepository },
  ],
})
export class GovernancaModule {}
