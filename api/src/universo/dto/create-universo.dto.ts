import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUniversoDto {
  @ApiProperty({ example: 'Secretaria de Finanças' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ enum: ['AREA', 'PROCESSO', 'TEMA', 'PROJETO'] })
  @IsString()
  @IsIn(['AREA', 'PROCESSO', 'TEMA', 'PROJETO'])
  tipo: string;

  @ApiProperty({ example: 'SECRETARIA_X' })
  @IsString()
  @IsNotEmpty()
  unidadeResponsavel: string;

  @ApiProperty({ minimum: 1, maximum: 5, example: 3 })
  @IsInt()
  @Min(1)
  @Max(5)
  materialidade: number;

  @ApiProperty({ minimum: 1, maximum: 5, example: 4 })
  @IsInt()
  @Min(1)
  @Max(5)
  relevancia: number;

  @ApiProperty({ minimum: 1, maximum: 5, example: 3 })
  @IsInt()
  @Min(1)
  @Max(5)
  criticidade: number;

  @ApiProperty({ minimum: 1, maximum: 5, example: 2 })
  @IsInt()
  @Min(1)
  @Max(5)
  risco: number;
}
