import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompetenciaDto {
  @ApiProperty({ example: 'Auditoria Financeira' })
  @IsString() @IsNotEmpty()
  nome: string;

  @ApiProperty({ enum: ['TECNICA', 'GERENCIAL'], example: 'TECNICA' })
  @IsString() @IsIn(['TECNICA', 'GERENCIAL'])
  tipo: string;

  @ApiPropertyOptional({ example: 'Auditoria Governamental' })
  @IsOptional() @IsString()
  areaAuditoria?: string;
}
