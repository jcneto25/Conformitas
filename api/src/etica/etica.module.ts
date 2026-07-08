import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EticaService } from './etica.service';
import { EticaController } from './etica.controller';
import {
  PrismaDeclaracaoRepository,
  PrismaImpedimentoRepository,
  PrismaClassificacaoRepository,
  PrismaLogSigilosoRepository,
} from './repositories/prisma-etica.repository';
import {
  DECLARACAO_REPOSITORY,
  IMPEDIMENTO_REPOSITORY,
  CLASSIFICACAO_REPOSITORY,
  LOG_SIGILOSO_REPOSITORY,
} from './repositories/declaracao.repository';
@Module({
  imports: [PrismaModule],
  controllers: [EticaController],
  providers: [
    EticaService,
    { provide: DECLARACAO_REPOSITORY, useClass: PrismaDeclaracaoRepository },
    { provide: IMPEDIMENTO_REPOSITORY, useClass: PrismaImpedimentoRepository },
    { provide: CLASSIFICACAO_REPOSITORY, useClass: PrismaClassificacaoRepository },
    { provide: LOG_SIGILOSO_REPOSITORY, useClass: PrismaLogSigilosoRepository },
  ],
})
export class EticaModule {}
