import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImpedimentoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  auditoriaId: string;

  @ApiProperty({ example: 'Atuei na unidade auditada há 6 meses' })
  @IsString()
  @IsNotEmpty()
  motivo: string;
}
