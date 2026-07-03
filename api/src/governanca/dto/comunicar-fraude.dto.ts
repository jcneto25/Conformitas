import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TipoComunicacao {
  SUPERIOR = 'SUPERIOR',
  TCE = 'TCE',
}

export class ComunicarFraudeDto {
  @ApiProperty({ enum: TipoComunicacao, enumName: 'TipoComunicacao', example: 'SUPERIOR' })
  @IsEnum(TipoComunicacao, { message: 'Tipo deve ser SUPERIOR ou TCE' })
  @IsNotEmpty()
  tipo: TipoComunicacao;
}
