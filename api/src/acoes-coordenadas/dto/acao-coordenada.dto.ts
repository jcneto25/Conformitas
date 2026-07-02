import { IsString, IsNotEmpty, IsOptional, IsDateString, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum StatusAcaoCoordenada {
  RECEBIDA = 'RECEBIDA',
  EM_ANALISE = 'EM_ANALISE',
  EM_EXECUCAO = 'EM_EXECUCAO',
  CONCLUIDA = 'CONCLUIDA',
  REPORTADA = 'REPORTADA',
}

export class CreateAcaoCoordenadaDto {
  @ApiProperty({ example: 'SIAUD-2026-0001' })
  @IsString()
  @IsNotEmpty()
  codigoSiaud: string;

  @ApiProperty({ example: 'Ação Coordenada - Auditoria em Folha de Pagamento' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiPropertyOptional({ example: 'Avaliar conformidade da folha de pagamento...' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({ example: 'Metodologia XYZ' })
  @IsOptional()
  @IsString()
  metodologia?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dataAprovacaoCpa?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  prazoExecucao?: string;

  @ApiProperty({ enum: StatusAcaoCoordenada, default: StatusAcaoCoordenada.RECEBIDA })
  @IsString()
  @IsNotEmpty()
  status: StatusAcaoCoordenada;
}

export class UpdateAcaoCoordenadaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metodologia?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dataAprovacaoCpa?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  prazoExecucao?: string;

  @ApiPropertyOptional({ enum: StatusAcaoCoordenada })
  @IsOptional()
  @IsString()
  status?: StatusAcaoCoordenada;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  auditoriaId?: string;
}

export class ReportarResultadoDto {
  @ApiProperty({ description: 'ID da auditoria vinculada' })
  @IsUUID()
  @IsNotEmpty()
  auditoriaId: string;
}
