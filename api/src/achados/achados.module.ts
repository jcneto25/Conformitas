import { Module } from '@nestjs/common';
import { AchadosService } from './achados.service';
import { AchadosController } from './achados.controller';

@Module({
  controllers: [AchadosController],
  providers: [AchadosService],
  exports: [AchadosService],
})
export class AchadosModule {}
