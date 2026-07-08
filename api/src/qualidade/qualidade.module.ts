import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { QualidadeService } from './qualidade.service';
import { QualidadeController } from './qualidade.controller';
import { PrismaAvaliacaoRepository } from './repositories/prisma-avaliacao.repository';
import { PrismaNaoConformidadeRepository } from './repositories/prisma-nao-conformidade.repository';
import { PrismaIndicadorRepository } from './repositories/prisma-indicador.repository';
import { AVALIACAO_REPOSITORY } from './repositories/avaliacao.repository';
import { NAO_CONFORMIDADE_REPOSITORY } from './repositories/nao-conformidade.repository';
import { INDICADOR_REPOSITORY } from './repositories/indicador.repository';
@Module({
  imports: [PrismaModule],
  controllers: [QualidadeController],
  providers: [
    QualidadeService,
    { provide: AVALIACAO_REPOSITORY, useClass: PrismaAvaliacaoRepository },
    { provide: NAO_CONFORMIDADE_REPOSITORY, useClass: PrismaNaoConformidadeRepository },
    { provide: INDICADOR_REPOSITORY, useClass: PrismaIndicadorRepository },
  ],
})
export class QualidadeModule {}
