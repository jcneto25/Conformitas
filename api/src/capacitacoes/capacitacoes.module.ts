import { Module } from '@nestjs/common';
import { CapacitacoesService } from './capacitacoes.service';
import { CapacitacoesController } from './capacitacoes.controller';

@Module({ controllers: [CapacitacoesController], providers: [CapacitacoesService], exports: [CapacitacoesService] })
export class CapacitacoesModule {}
