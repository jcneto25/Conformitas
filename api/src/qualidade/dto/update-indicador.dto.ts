import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateIndicadorDto } from './create-indicador.dto';

export class UpdateIndicadorDto extends PartialType(CreateIndicadorDto) {
  @ApiPropertyOptional({ example: 92.5 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Valor atual mínimo é 0' })
  valorAtual?: number;
}
