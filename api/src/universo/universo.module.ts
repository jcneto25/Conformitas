import { Module } from '@nestjs/common';
import { UniversoService } from './universo.service';
import { UniversoController } from './universo.controller';

@Module({
  controllers: [UniversoController],
  providers: [UniversoService],
  exports: [UniversoService],
})
export class UniversoModule {}
