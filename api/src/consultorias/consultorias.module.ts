import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConsultoriasService } from './consultorias.service';
import { ConsultoriasController } from './consultorias.controller';

@Module({ imports: [PrismaModule], controllers: [ConsultoriasController], providers: [ConsultoriasService], exports: [ConsultoriasService] })
export class ConsultoriasModule {}
