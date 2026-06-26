import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClassificarDocumentoDto {
  @ApiProperty({ enum: ['PUBLICO', 'INTERNO', 'RESTRITO', 'SIGILOSO'] })
  @IsString()
  @IsIn(['PUBLICO', 'INTERNO', 'RESTRITO', 'SIGILOSO'])
  nivelSigilo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  justificativa?: string;
}
