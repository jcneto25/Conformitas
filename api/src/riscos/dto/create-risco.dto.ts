import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRiscoDto {
  @ApiProperty({ example: 'RISCO-001' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ example: 'Risco de falta de documentação fiscal' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiPropertyOptional({ example: 'OPERACIONAL' })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiPropertyOptional({ example: 'Ausência de controles internos' })
  @IsOptional()
  @IsString()
  causa?: string;

  @ApiPropertyOptional({ example: 'Erro no cálculo de tributos' })
  @IsOptional()
  @IsString()
  evento?: string;

  @ApiPropertyOptional({ example: 'Multas e penalidades' })
  @IsOptional()
  @IsString()
  consequencia?: string;

  @ApiProperty({ minimum: 1, maximum: 5, example: 3 })
  @IsInt()
  @Min(1)
  @Max(5)
  probabilidade: number;

  @ApiProperty({ minimum: 1, maximum: 5, example: 4 })
  @IsInt()
  @Min(1)
  @Max(5)
  impacto: number;

  @ApiPropertyOptional({ enum: ['EVITAR', 'MITIGAR', 'TRANSFERIR', 'ACEITAR'] })
  @IsOptional()
  @IsString()
  @IsIn(['EVITAR', 'MITIGAR', 'TRANSFERIR', 'ACEITAR'])
  estrategia?: string;

  @ApiPropertyOptional({ example: 'Implementar controle de conciliação' })
  @IsOptional()
  @IsString()
  planoAcao?: string;

  @ApiProperty({ enum: ['IDENTIFICADO', 'EM_TRATAMENTO', 'MITIGADO', 'ACEITO'], example: 'IDENTIFICADO' })
  @IsString()
  @IsIn(['IDENTIFICADO', 'EM_TRATAMENTO', 'MITIGADO', 'ACEITO'])
  status: string;
}
