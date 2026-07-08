import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LogsSistemaService } from './logs-sistema.service';
import { LogsSistemaController } from './logs-sistema.controller';
import { PrismaLogSistemaRepository } from './repositories/prisma-log-sistema.repository';
import { LOG_SISTEMA_REPOSITORY } from './repositories/log-sistema.repository';
@Global()
@Module({
  imports: [PrismaModule],
  controllers: [LogsSistemaController],
  providers: [LogsSistemaService, { provide: LOG_SISTEMA_REPOSITORY, useClass: PrismaLogSistemaRepository }],
  exports: [LogsSistemaService],
})
export class LogsSistemaModule {}
