import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TipoAvaliacao {
  MONITORAMENTO = 'MONITORAMENTO',
  AUTOAVALIACAO = 'AUTOAVALIACAO',
  EXTERNA = 'EXTERNA',
}

export enum StatusAvaliacao {
  RASCUNHO = 'RASCUNHO',
  CONCLUIDA = 'CONCLUIDA',
  HOMOLOGADA = 'HOMOLOGADA',
}

export class CreateAvaliacaoDto {
  @ApiProperty({ enum: TipoAvaliacao, enumName: 'TipoAvaliacao', example: 'AUTOAVALIACAO' })
  @IsEnum(TipoAvaliacao, { message: 'Tipo deve ser MONITORAMENTO, AUTOAVALIACAO ou EXTERNA' })
  tipo: TipoAvaliacao;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString({}, { message: 'periodoInicio deve ser uma data válida' })
  @IsNotEmpty()
  periodoInicio: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString({}, { message: 'periodoFim deve ser uma data válida' })
  @IsNotEmpty()
  periodoFim: string;

  @ApiPropertyOptional({ example: 'Avaliação concluída com resultados satisfatórios' })
  @IsOptional()
  @IsString()
  resultado?: string;

  @ApiPropertyOptional({ example: 8.5 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Nota mínima é 0' })
  @Max(10, { message: 'Nota máxima é 10' })
  nota?: number;
}
