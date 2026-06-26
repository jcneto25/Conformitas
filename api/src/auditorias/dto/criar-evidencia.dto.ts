import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarEvidenciaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fonte?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  arquivoPath: string;
}
