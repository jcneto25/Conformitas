import { Module } from '@nestjs/common';
import { EticaService } from './etica.service';
import { EticaController } from './etica.controller';

@Module({ controllers: [EticaController], providers: [EticaService], exports: [EticaService] })
export class EticaModule {}
