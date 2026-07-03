import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Base normativa dos 4 atributos do achado (RF-006.2) — fonte única da citação. */
const NORMA_ACHADO = 'CNJ 309 art. 46';

/**
 * Classificação do achado conforme PRP-006 §4 (POSITIVO/NEGATIVO).
 * A triade CONFORMIDADE/OPORTUNIDADE/IRREGULARIDADE usada em outras telas
 * não corresponde ao contrato deste PRP.
 */
export enum TipoAchado {
  POSITIVO = 'POSITIVO',
  NEGATIVO = 'NEGATIVO',
}

/**
 * DTO de criação de achado. Os 4 atributos obrigatórios (situação encontrada,
 * critério, causa, efeito) são exigidos por CNJ 309 art. 46 — RF-006.2.
 *
 * `auditoriaId` vem do path (`/auditorias/:auditoriaId/achados`) e `autorId`
 * do JWT (`req.user.sub`), portanto não fazem parte do corpo validado.
 */
export class CreateAchadoDto {
  @ApiProperty({ enum: TipoAchado, enumName: 'TipoAchado', example: 'NEGATIVO' })
  @IsEnum(TipoAchado, { message: 'Tipo deve ser POSITIVO ou NEGATIVO' })
  tipo: TipoAchado;

  @ApiProperty({ example: 'Conciliação bancária não evidenciada' })
  @IsString()
  @IsNotEmpty({ message: `Situação encontrada é obrigatória (${NORMA_ACHADO})` })
  situacaoEncontrada: string;

  @ApiProperty({ example: `Resolução ${NORMA_ACHADO}` })
  @IsString()
  @IsNotEmpty({ message: `Critério é obrigatório (${NORMA_ACHADO})` })
  criterio: string;

  @ApiProperty({ example: 'Falta de conciliação rotineira' })
  @IsString()
  @IsNotEmpty({ message: `Causa é obrigatória (${NORMA_ACHADO})` })
  causa: string;

  @ApiProperty({ example: 'Risco de divergência de saldos' })
  @IsString()
  @IsNotEmpty({ message: `Efeito é obrigatório (${NORMA_ACHADO})` })
  efeito: string;

  @ApiPropertyOptional({ type: [String], description: 'UUIDs das evidências vinculadas' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Evidências devem ser uma lista de UUIDs válidos' })
  evidenciaIds?: string[];
}
