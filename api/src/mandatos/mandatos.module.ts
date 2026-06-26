import { Module } from '@nestjs/common';
import { MandatosService } from './mandatos.service';
import { MandatosController } from './mandatos.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MandatosController],
  providers: [MandatosService],
  exports: [MandatosService],
})
export class MandatosModule {}
