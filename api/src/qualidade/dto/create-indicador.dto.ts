import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Periodicidade {
  MENSAL = 'MENSAL',
  TRIMESTRAL = 'TRIMESTRAL',
  ANUAL = 'ANUAL',
}

export class CreateIndicadorDto {
  @ApiProperty({ example: 'Taxa de Conformidade' })
  @IsString()
  @IsNotEmpty({ message: 'Nome do indicador é obrigatório' })
  nome: string;

  @ApiPropertyOptional({ example: 'Percentual de auditorias com parecer favorável' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ enum: Periodicidade, enumName: 'Periodicidade', example: 'TRIMESTRAL' })
  @IsEnum(Periodicidade, { message: 'Periodicidade deve ser MENSAL, TRIMESTRAL ou ANUAL' })
  periodicidade: Periodicidade;

  @ApiPropertyOptional({ example: 90 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Meta mínima é 0' })
  meta?: number;
}
