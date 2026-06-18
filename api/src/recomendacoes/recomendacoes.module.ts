import { Module } from '@nestjs/common';
import { RecomendacoesService } from './recomendacoes.service';
import { RecomendacoesController } from './recomendacoes.controller';

@Module({ controllers: [RecomendacoesController], providers: [RecomendacoesService], exports: [RecomendacoesService] })
export class RecomendacoesModule {}
