import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RelatoriosService } from './relatorios.service';
import { RelatorioPdfService } from './relatorio-pdf.service';
import {
  RelatoriosController,
  RelatoriosAuditoriaController,
  RelatoriosAnuaisController,
} from './relatorios.controller';

@Module({
  imports: [PrismaModule],
  controllers: [RelatoriosController, RelatoriosAuditoriaController, RelatoriosAnuaisController],
  providers: [RelatoriosService, RelatorioPdfService],
  exports: [RelatoriosService, RelatorioPdfService],
})
export class RelatoriosModule {}
