import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificacoesModule } from '../notificacoes/notificacoes.module';
import { AchadosService } from './achados.service';
import { AchadosController } from './achados.controller';
import { AuditoriaAchadosController } from './auditoria-achados.controller';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [PrismaModule, NotificacoesModule],
  controllers: [AchadosController, AuditoriaAchadosController],
  providers: [AchadosService, ScheduleService],
  exports: [AchadosService],
})
export class AchadosModule {}
