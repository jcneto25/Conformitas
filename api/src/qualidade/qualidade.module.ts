import { Module } from '@nestjs/common';
import { QualidadeService } from './qualidade.service';
import { QualidadeController } from './qualidade.controller';

@Module({ controllers: [QualidadeController], providers: [QualidadeService], exports: [QualidadeService] })
export class QualidadeModule {}
