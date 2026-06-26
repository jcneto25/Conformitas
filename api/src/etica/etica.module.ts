import { Module } from '@nestjs/common';
import { EticaService } from './etica.service';
import { EticaController } from './etica.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EticaController],
  providers: [EticaService],
  exports: [EticaService],
})
export class EticaModule {}
