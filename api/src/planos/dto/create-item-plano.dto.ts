import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
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
  prioridade?: string;
}
