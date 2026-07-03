import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Tipos de manifestação da unidade auditada — PRP-006 §4 / RF-006.4.
 */
export enum TipoManifestacao {
  ESCLARECIMENTO = 'ESCLARECIMENTO',
  JUSTIFICATIVA = 'JUSTIFICATIVA',
  CONCORDANCIA = 'CONCORDANCIA',
  DISCORDANCIA = 'DISCORDANCIA',
}

/**
 * DTO de registro de manifestação. `autorId` vem do JWT (`req.user.sub`).
 */
export class CreateManifestacaoDto {
  @ApiProperty({ example: 'A unidade esclarece que...' })
  @IsString()
  @IsNotEmpty({ message: 'Conteúdo da manifestação é obrigatório' })
  conteudo: string;

  @ApiProperty({ enum: TipoManifestacao, enumName: 'TipoManifestacao', example: 'JUSTIFICATIVA' })
  @IsEnum(TipoManifestacao, { message: 'Tipo de manifestação inválido' })
  tipo: TipoManifestacao;
}
