import { IsString, IsNotEmpty, IsOptional, IsIn, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentoDto {
  @ApiProperty({ example: 'Manual de Auditoria v2.0' })
  @IsString() @IsNotEmpty()
  titulo: string;

  @ApiProperty({ enum: ['NORMA', 'MANUAL', 'TEMPLATE', 'CHECKLIST'], example: 'MANUAL' })
  @IsString() @IsIn(['NORMA', 'MANUAL', 'TEMPLATE', 'CHECKLIST'])
  tipo: string;

  @ApiPropertyOptional({ example: 'Auditoria Governamental' })
  @IsOptional() @IsString()
  categoria?: string;

  @ApiPropertyOptional({ example: '1.0' })
  @IsOptional() @IsString()
  versao?: string;

  @ApiProperty({ example: '/uploads/biblioteca/manual-auditoria-v2.pdf' })
  @IsString() @IsNotEmpty()
  arquivoPath: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional() @IsDateString()
  vigenciaInicio?: string;

  @ApiPropertyOptional({ example: '2027-01-01' })
  @IsOptional() @IsDateString()
  vigenciaFim?: string;

  @ApiProperty({ enum: ['ATIVO', 'ARQUIVADO', 'REVISADO'], example: 'ATIVO' })
  @IsString() @IsIn(['ATIVO', 'ARQUIVADO', 'REVISADO'])
  status: string;
}
