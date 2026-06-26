import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AchadosService } from './achados.service';
import { AchadosController } from './achados.controller';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [PrismaModule],
  controllers: [AchadosController],
  providers: [AchadosService, ScheduleService],
  exports: [AchadosService],
})
export class AchadosModule {}
