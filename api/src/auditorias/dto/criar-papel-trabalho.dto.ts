import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarPapelTrabalhoDto {
  @ApiProperty({ example: 'PT-001' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  evidenciaIds?: string[];
}
