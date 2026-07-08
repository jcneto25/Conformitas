import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { RecomendacoesService } from './recomendacoes.service';
import { RecomendacoesController } from './recomendacoes.controller';
import { RecomendacoesSchedule } from './recomendacoes.schedule';
import {
  PrismaRecomendacaoRepository,
  PrismaProvidenciaRepository,
} from './repositories/prisma-recomendacao.repository';
import { RECOMENDACAO_REPOSITORY, PROVIDENCIA_REPOSITORY } from './repositories/recomendacao.repository';
@Module({
  imports: [PrismaModule, ScheduleModule],
  controllers: [RecomendacoesController],
  providers: [
    RecomendacoesService,
    RecomendacoesSchedule,
    { provide: RECOMENDACAO_REPOSITORY, useClass: PrismaRecomendacaoRepository },
    { provide: PROVIDENCIA_REPOSITORY, useClass: PrismaProvidenciaRepository },
  ],
})
export class RecomendacoesModule {}
