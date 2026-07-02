import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsIn, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuditoriaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemPlanoId: string;

  @ApiPropertyOptional({ enum: ['CONFORMIDADE', 'OPERACIONAL', 'FINANCEIRA', 'GESTAO', 'ESPECIAL'] })
  @IsOptional()
  @IsString()
  @IsIn(['CONFORMIDADE', 'OPERACIONAL', 'FINANCEIRA', 'GESTAO', 'ESPECIAL'])
  tipo?: string;

  @ApiPropertyOptional({ enum: ['DIRETA', 'INTEGRADA', 'INDIRETA', 'TERCEIRIZADA'] })
  @IsOptional()
  @IsString()
  @IsIn(['DIRETA', 'INTEGRADA', 'INDIRETA', 'TERCEIRIZADA'])
  forma?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  sigilosa?: boolean;

  @ApiPropertyOptional({ description: 'Data prevista para conclusão' })
  @IsOptional()
  @IsDateString()
  dataFimPrevista?: string;
}
