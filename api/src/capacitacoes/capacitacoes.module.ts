import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CapacitacoesService } from './capacitacoes.service';
import { CapacitacoesController } from './capacitacoes.controller';

@Module({ imports: [PrismaModule], controllers: [CapacitacoesController], providers: [CapacitacoesService], exports: [CapacitacoesService] })
export class CapacitacoesModule {}
