import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OrgaoDeterminacao {
  TCE = 'TCE',
  CNJ = 'CNJ',
  OUTRO = 'OUTRO',
}

export enum StatusDeterminacao {
  PENDENTE = 'PENDENTE',
  CONCLUIDA = 'CONCLUIDA',
}

export class CreateDeterminacaoDto {
  @ApiProperty({ enum: OrgaoDeterminacao, enumName: 'OrgaoDeterminacao', example: 'TCE' })
  @IsEnum(OrgaoDeterminacao, { message: 'Órgão deve ser TCE, CNJ ou OUTRO' })
  orgao: OrgaoDeterminacao;

  @ApiProperty({ example: '123/2026' })
  @IsString()
  @IsNotEmpty({ message: 'Número da determinação é obrigatório' })
  numero: string;

  @ApiProperty({ example: 'Determinação para implementação de controle interno' })
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  descricao: string;

  @ApiPropertyOptional({ example: '2026-08-01' })
  @IsOptional()
  @IsDateString({}, { message: 'Prazo resposta deve ser uma data válida' })
  prazoResposta?: string;
}
