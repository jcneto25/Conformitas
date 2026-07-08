import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RiscosService } from './riscos.service';
import { RiscosController } from './riscos.controller';
import { PrismaRiscoRepository } from './repositories/prisma-risco.repository';
import { RISCO_REPOSITORY } from './repositories/risco.repository';
@Module({
  imports: [PrismaModule],
  controllers: [RiscosController],
  providers: [RiscosService, { provide: RISCO_REPOSITORY, useClass: PrismaRiscoRepository }],
})
export class RiscosModule {}
