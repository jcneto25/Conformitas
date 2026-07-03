import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ClassificacaoFraude {
  SUSPEITA = 'SUSPEITA',
  CONFIRMADA = 'CONFIRMADA',
  DESCARTADA = 'DESCARTADA',
}

export class CreateRegistroFraudeDto {
  @ApiPropertyOptional({ example: 'uuid-da-auditoria' })
  @IsOptional()
  @IsUUID('4', { message: 'auditoriaId deve ser um UUID válido' })
  auditoriaId?: string;

  @ApiProperty({ example: 'Indício de sobrepreço em contrato de TI' })
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  descricao: string;

  @ApiProperty({ enum: ClassificacaoFraude, enumName: 'ClassificacaoFraude', example: 'SUSPEITA' })
  @IsEnum(ClassificacaoFraude, { message: 'Classificação deve ser SUSPEITA, CONFIRMADA ou DESCARTADA' })
  classificacao: ClassificacaoFraude;
}
