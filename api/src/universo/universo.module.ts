import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UniversoService } from './universo.service';
import { UniversoController } from './universo.controller';
import { PrismaUniversoAuditavelRepository } from './repositories/prisma-universo-auditavel.repository';
import { UNIVERSO_AUDITAVEL_REPOSITORY } from './repositories/universo-auditavel.repository';
@Module({
  imports: [PrismaModule],
  controllers: [UniversoController],
  providers: [UniversoService, { provide: UNIVERSO_AUDITAVEL_REPOSITORY, useClass: PrismaUniversoAuditavelRepository }],
})
export class UniversoModule {}
