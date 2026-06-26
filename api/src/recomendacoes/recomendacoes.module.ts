import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RecomendacoesService } from './recomendacoes.service';
import { RecomendacoesController } from './recomendacoes.controller';

@Module({ imports: [PrismaModule], controllers: [RecomendacoesController], providers: [RecomendacoesService], exports: [RecomendacoesService] })
export class RecomendacoesModule {}
