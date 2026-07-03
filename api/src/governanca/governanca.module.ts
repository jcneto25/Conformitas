import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GovernancaService } from './governanca.service';
import { GovernancaController } from './governanca.controller';
import { GovernancaSchedule } from './governanca.schedule';

@Module({
  imports: [PrismaModule],
  controllers: [GovernancaController],
  providers: [GovernancaService, GovernancaSchedule],
  exports: [GovernancaService],
})
export class GovernancaModule {}
