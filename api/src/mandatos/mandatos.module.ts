import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MandatosService } from './mandatos.service';
import { MandatosController } from './mandatos.controller';
import { PrismaMandatoAuditorChefeRepository } from './repositories/prisma-mandato-auditor-chefe.repository';
import { MANDATO_AUDITOR_CHEFE_REPOSITORY } from './repositories/mandato-auditor-chefe.repository';
@Module({
  imports: [PrismaModule],
  controllers: [MandatosController],
  providers: [
    MandatosService,
    { provide: MANDATO_AUDITOR_CHEFE_REPOSITORY, useClass: PrismaMandatoAuditorChefeRepository },
  ],
  exports: [MandatosService],
})
export class MandatosModule {}
