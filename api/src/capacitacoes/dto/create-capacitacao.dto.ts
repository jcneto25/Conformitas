import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCapacitacaoDto {
  @ApiProperty({ example: 'Curso de Auditoria Governamental' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiPropertyOptional({ example: 'ENAP' })
  @IsOptional()
  @IsString()
  instituicao?: string;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(1)
  cargaHoraria: number;

  @ApiProperty({ example: 'CURSO' })
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @ApiProperty({ example: '2026-03-01' })
  @IsDateString()
  dataInicio: string;

  @ApiPropertyOptional({ example: '2026-03-05' })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiProperty({ example: ['user-001', 'user-002'] })
  @IsArray()
  @IsString({ each: true })
  participanteIds: string[];

  @ApiPropertyOptional({ example: '/uploads/certificados/curso-auditoria.pdf' })
  @IsOptional()
  @IsString()
  certificadoPath?: string;
}
