import { Module } from '@nestjs/common';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaController } from './biblioteca.controller';

@Module({ controllers: [BibliotecaController], providers: [BibliotecaService], exports: [BibliotecaService] })
export class BibliotecaModule {}
