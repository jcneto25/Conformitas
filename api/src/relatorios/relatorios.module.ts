import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosController } from './relatorios.controller';
import { RelatorioPdfService } from './relatorio-pdf.service';
import { PrismaRelatorioRepository, PrismaRelatorioAnualRepository } from './repositories/prisma-relatorio.repository';
import { RELATORIO_REPOSITORY, RELATORIO_ANUAL_REPOSITORY } from './repositories/relatorio.repository';
@Module({
  imports: [PrismaModule],
  controllers: [RelatoriosController],
  providers: [
    RelatoriosService,
    RelatorioPdfService,
    { provide: RELATORIO_REPOSITORY, useClass: PrismaRelatorioRepository },
    { provide: RELATORIO_ANUAL_REPOSITORY, useClass: PrismaRelatorioAnualRepository },
  ],
})
export class RelatoriosModule {}
