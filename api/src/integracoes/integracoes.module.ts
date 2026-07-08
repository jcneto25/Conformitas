import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IntegracoesService } from './integracoes.service';
import { IntegracoesController } from './integracoes.controller';
import { PrismaIntegracaoRepository } from './repositories/prisma-integracao.repository';
import { PrismaLogIntegracaoRepository } from './repositories/prisma-log-integracao.repository';
import { INTEGRACAO_REPOSITORY } from './repositories/integracao.repository';
import { LOG_INTEGRACAO_REPOSITORY } from './repositories/log-integracao.repository';
@Module({
  imports: [PrismaModule],
  controllers: [IntegracoesController],
  providers: [
    IntegracoesService,
    { provide: INTEGRACAO_REPOSITORY, useClass: PrismaIntegracaoRepository },
    { provide: LOG_INTEGRACAO_REPOSITORY, useClass: PrismaLogIntegracaoRepository },
  ],
})
export class IntegracoesModule {}
