import { SetMetadata } from '@nestjs/common';

export const CLASSIFICACAO_KEY = 'classificacao';

export interface ClassificacaoMetadata {
  entidadeTipo: string;
  entidadeIdParam: string;
}

export const ExigeClassificacao = (meta: ClassificacaoMetadata) => SetMetadata(CLASSIFICACAO_KEY, meta);
