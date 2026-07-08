import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AcoesCoordenadasService } from './acoes-coordenadas.service';
import { AcoesCoordenadasController } from './acoes-coordenadas.controller';
import { PrismaAcaoCoordenadaRepository } from './repositories/prisma-acao-coordenada.repository';
import { ACAO_COORDENADA_REPOSITORY } from './repositories/acao-coordenada.repository';
@Module({
  imports: [PrismaModule],
  controllers: [AcoesCoordenadasController],
  providers: [
    AcoesCoordenadasService,
    { provide: ACAO_COORDENADA_REPOSITORY, useClass: PrismaAcaoCoordenadaRepository },
  ],
})
export class AcoesCoordenadasModule {}
