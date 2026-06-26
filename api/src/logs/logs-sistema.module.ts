import { Module, Global } from '@nestjs/common';
import { LogsSistemaService } from './logs-sistema.service';
import { LogsSistemaController } from './logs-sistema.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [LogsSistemaController],
  providers: [LogsSistemaService],
  exports: [LogsSistemaService],
})
export class LogsSistemaModule {}
