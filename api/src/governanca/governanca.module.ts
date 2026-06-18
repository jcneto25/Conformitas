import { Module } from '@nestjs/common';
import { GovernancaService } from './governanca.service';
import { GovernancaController } from './governanca.controller';

@Module({ controllers: [GovernancaController], providers: [GovernancaService], exports: [GovernancaService] })
export class GovernancaModule {}
