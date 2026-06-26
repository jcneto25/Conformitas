import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMandatoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  usuarioId: string;

  @ApiProperty()
  @IsDateString()
  dataInicio: string;

  @ApiProperty()
  @IsDateString()
  dataFimPrevista: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  atoDesignacao: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dataFimReal?: string;

  @ApiPropertyOptional({ default: 'ATIVO' })
  @IsOptional()
  @IsString()
  status?: string;
}
