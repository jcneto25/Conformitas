import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardFilterDto {
  @ApiPropertyOptional({ description: 'Período início (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  periodoInicio?: string;

  @ApiPropertyOptional({ description: 'Período fim (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  periodoFim?: string;

  @ApiPropertyOptional({ description: 'Ano de referência', example: 2026 })
  @IsOptional()
  ano?: number;

  @ApiPropertyOptional({ description: 'Unidade auditada (filtro)' })
  @IsOptional()
  @IsString()
  unidade?: string;
}
