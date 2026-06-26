import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AchadosService } from './achados.service';
import { AchadosController } from './achados.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AchadosController],
  providers: [AchadosService],
  exports: [AchadosService],
})
export class AchadosModule {}
