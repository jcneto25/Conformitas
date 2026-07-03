import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Severidade {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA',
}

export enum StatusNaoConformidade {
  ABERTA = 'ABERTA',
  EM_CORRECAO = 'EM_CORRECAO',
  CORRIGIDA = 'CORRIGIDA',
}

export class CreateNaoConformidadeDto {
  @ApiProperty({ example: 'Papéis de trabalho sem evidência vinculada' })
  @IsString()
  @IsNotEmpty({ message: 'Descrição da não conformidade é obrigatória' })
  descricao: string;

  @ApiPropertyOptional({ example: 'DIRAUD-Jud art. XX' })
  @IsOptional()
  @IsString()
  normaReferencia?: string;

  @ApiProperty({ enum: Severidade, enumName: 'Severidade', example: 'ALTA' })
  @IsEnum(Severidade, { message: 'Severidade deve ser BAIXA, MEDIA, ALTA ou CRITICA' })
  severidade: Severidade;

  @ApiPropertyOptional({ example: '2025-06-30' })
  @IsOptional()
  @IsDateString({}, { message: 'Prazo deve ser uma data válida' })
  prazo?: string;
}
