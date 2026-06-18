import { Module } from '@nestjs/common';
import { ConsultoriasService } from './consultorias.service';
import { ConsultoriasController } from './consultorias.controller';

@Module({ controllers: [ConsultoriasController], providers: [ConsultoriasService], exports: [ConsultoriasService] })
export class ConsultoriasModule {}
