import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RecomendacoesService } from './recomendacoes.service';
import { RecomendacoesController, RecomendacoesRelatorioController } from './recomendacoes.controller';
import { RecomendacoesSchedule } from './recomendacoes.schedule';

@Module({
  imports: [PrismaModule],
  controllers: [RecomendacoesController, RecomendacoesRelatorioController],
  providers: [RecomendacoesService, RecomendacoesSchedule],
  exports: [RecomendacoesService],
})
export class RecomendacoesModule {}
