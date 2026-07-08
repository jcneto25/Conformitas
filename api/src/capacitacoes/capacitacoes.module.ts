import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CapacitacoesService } from './capacitacoes.service';
import { CapacitacoesController } from './capacitacoes.controller';
import { PrismaCapacitacaoRepository } from './repositories/prisma-capacitacao.repository';
import { CAPACITACAO_REPOSITORY } from './repositories/capacitacao.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CapacitacoesController],
  providers: [CapacitacoesService, { provide: CAPACITACAO_REPOSITORY, useClass: PrismaCapacitacaoRepository }],
  exports: [CapacitacoesService],
})
export class CapacitacoesModule {}
