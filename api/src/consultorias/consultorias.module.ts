import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConsultoriasService } from './consultorias.service';
import { ConsultoriasController } from './consultorias.controller';
import { PrismaSolicitacaoConsultoriaRepository } from './repositories/prisma-solicitacao-consultoria.repository';
import { PrismaConsultoriaRepository } from './repositories/prisma-consultoria.repository';
import { SOLICITACAO_CONSULTORIA_REPOSITORY } from './repositories/solicitacao-consultoria.repository';
import { CONSULTORIA_REPOSITORY } from './repositories/consultoria.repository';
@Module({
  imports: [PrismaModule],
  controllers: [ConsultoriasController],
  providers: [
    ConsultoriasService,
    { provide: SOLICITACAO_CONSULTORIA_REPOSITORY, useClass: PrismaSolicitacaoConsultoriaRepository },
    { provide: CONSULTORIA_REPOSITORY, useClass: PrismaConsultoriaRepository },
  ],
})
export class ConsultoriasModule {}
