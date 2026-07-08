import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PlanosService } from './planos.service';
import { PlanosController } from './planos.controller';
import { PrismaPlanoAuditoriaRepository } from './repositories/prisma-plano-auditoria.repository';
import { PrismaItemPlanoRepository } from './repositories/prisma-item-plano.repository';
import { PrismaForcaTrabalhoRepository } from './repositories/prisma-forca-trabalho.repository';
import { PLANO_AUDITORIA_REPOSITORY } from './repositories/plano-auditoria.repository';
import { ITEM_PLANO_REPOSITORY } from './repositories/item-plano.repository';
import { FORCA_TRABALHO_REPOSITORY } from './repositories/forca-trabalho.repository';
@Module({
  imports: [PrismaModule],
  controllers: [PlanosController],
  providers: [
    PlanosService,
    { provide: PLANO_AUDITORIA_REPOSITORY, useClass: PrismaPlanoAuditoriaRepository },
    { provide: ITEM_PLANO_REPOSITORY, useClass: PrismaItemPlanoRepository },
    { provide: FORCA_TRABALHO_REPOSITORY, useClass: PrismaForcaTrabalhoRepository },
  ],
  exports: [PlanosService],
})
export class PlanosModule {}
