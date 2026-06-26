import { Module } from '@nestjs/common';
import { UniversoService } from './universo.service';
import { UniversoController } from './universo.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UniversoController],
  providers: [UniversoService],
  exports: [UniversoService],
})
export class UniversoModule {}
