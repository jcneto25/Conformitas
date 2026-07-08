import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificacoesModule } from '../notificacoes/notificacoes.module';
import { AchadosService } from './achados.service';
import { AchadosController } from './achados.controller';
import { AuditoriaAchadosController } from './auditoria-achados.controller';
import { ScheduleService } from './schedule.service';
import { CriarAchadoUseCase } from './use-cases/criar-achado.use-case';
import { EnviarManifestacaoUseCase } from './use-cases/enviar-manifestacao.use-case';
import { ConsolidarAchadoUseCase } from './use-cases/consolidar-achado.use-case';
import { RegistrarManifestacaoUseCase } from './use-cases/registrar-manifestacao.use-case';
import { PrismaAchadoRepository, PrismaManifestacaoRepository } from './repositories/prisma-achado.repository';
import { ACHADO_REPOSITORY, MANIFESTACAO_REPOSITORY } from './repositories/achado.repository';

@Module({
  imports: [PrismaModule, NotificacoesModule],
  controllers: [AchadosController, AuditoriaAchadosController],
  providers: [
    AchadosService,
    ScheduleService,
    CriarAchadoUseCase,
    EnviarManifestacaoUseCase,
    ConsolidarAchadoUseCase,
    RegistrarManifestacaoUseCase,
    { provide: ACHADO_REPOSITORY, useClass: PrismaAchadoRepository },
    { provide: MANIFESTACAO_REPOSITORY, useClass: PrismaManifestacaoRepository },
  ],
  exports: [AchadosService],
})
export class AchadosModule {}
