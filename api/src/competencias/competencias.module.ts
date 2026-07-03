import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CompetenciasService } from './competencias.service';
import { CompetenciasController } from './competencias.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CompetenciasController],
  providers: [CompetenciasService],
  exports: [CompetenciasService],
})
export class CompetenciasModule {}
