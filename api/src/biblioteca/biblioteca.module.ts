import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaController } from './biblioteca.controller';

@Module({ imports: [PrismaModule], controllers: [BibliotecaController], providers: [BibliotecaService], exports: [BibliotecaService] })
export class BibliotecaModule {}
