import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CompetenciasService } from './competencias.service';
import { CompetenciasController } from './competencias.controller';
import { PrismaCompetenciaRepository } from './repositories/prisma-competencia.repository';
import { COMPETENCIA_REPOSITORY } from './repositories/competencia.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CompetenciasController],
  providers: [CompetenciasService, { provide: COMPETENCIA_REPOSITORY, useClass: PrismaCompetenciaRepository }],
})
export class CompetenciasModule {}
