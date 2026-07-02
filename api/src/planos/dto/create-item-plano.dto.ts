import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemPlanoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  universoAuditavelId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tipoAuditoria?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  formaExecucao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  horasEstimadas?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  escopo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  objetivo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resultadosEsperados?: string;

  @ApiPropertyOptional({ type: [String], example: ['Auditor X', 'Auditor Y'] })
  @IsOptional()
  @IsArray()
  equipeIds?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Pergunta 1?', 'Pergunta 2?'] })
  @IsOptional()
  @IsArray()
  questoesAuditoria?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Teste de amostragem'] })
  @IsOptional()
  @IsArray()
  testesPrevistos?: string[];

  @ApiPropertyOptional({ example: '2026-02-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  cronogramaInicio?: string;

  @ApiPropertyOptional({ example: '2026-04-30T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  cronogramaFim?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prioridade?: string;
}
