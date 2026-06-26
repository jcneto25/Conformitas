import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GovernancaService } from './governanca.service';
import { GovernancaController } from './governanca.controller';

@Module({ imports: [PrismaModule], controllers: [GovernancaController], providers: [GovernancaService], exports: [GovernancaService] })
export class GovernancaModule {}
