import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificacoesModule } from '../notificacoes/notificacoes.module';
import { AuditoriasService } from './auditorias.service';
import { EvidenciasService } from './evidencias.service';
import { PapeisTrabalhoService } from './papeis-trabalho.service';
import { RequisicoesService } from './requisicoes.service';
import { ComunicadosService } from './comunicados.service';
import { AuditoriasController } from './auditorias.controller';
import { AuditoriaEvidenciasController, AuditoriaPapeisController, AuditoriaRequisicoesController } from './auditoria-sub-resources.controller';
import { AbrirAuditoriaUseCase } from './use-cases/abrir-auditoria.use-case';
import { IniciarExecucaoUseCase } from './use-cases/iniciar-execucao.use-case';
import { ConcluirAuditoriaUseCase } from './use-cases/concluir-auditoria.use-case';
import { SuspenderAuditoriaUseCase } from './use-cases/suspender-auditoria.use-case';
import { PrismaAuditoriaRepository, PrismaComunicadoRepository, PrismaEvidenciaRepository, PrismaPapelTrabalhoRepository, PrismaRequisicaoRepository } from './repositories/prisma-auditoria.repository';
import { AUDITORIA_REPOSITORY, COMUNICADO_REPOSITORY, EVIDENCIA_REPOSITORY, PAPEL_TRABALHO_REPOSITORY, REQUISICAO_REPOSITORY } from './repositories/auditoria.repository';

@Module({
  imports: [PrismaModule, NotificacoesModule],
  controllers: [AuditoriasController, AuditoriaEvidenciasController, AuditoriaPapeisController, AuditoriaRequisicoesController],
  providers: [
    AuditoriasService, EvidenciasService, PapeisTrabalhoService, RequisicoesService, ComunicadosService,
    AbrirAuditoriaUseCase, IniciarExecucaoUseCase, ConcluirAuditoriaUseCase, SuspenderAuditoriaUseCase,
    { provide: AUDITORIA_REPOSITORY, useClass: PrismaAuditoriaRepository },
    { provide: COMUNICADO_REPOSITORY, useClass: PrismaComunicadoRepository },
    { provide: EVIDENCIA_REPOSITORY, useClass: PrismaEvidenciaRepository },
    { provide: PAPEL_TRABALHO_REPOSITORY, useClass: PrismaPapelTrabalhoRepository },
    { provide: REQUISICAO_REPOSITORY, useClass: PrismaRequisicaoRepository },
  ],
  exports: [AuditoriasService],
})
export class AuditoriasModule {}
