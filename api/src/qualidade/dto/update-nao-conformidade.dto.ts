import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusNaoConformidade } from './create-nao-conformidade.dto';

export class UpdateNaoConformidadeDto {
  @ApiPropertyOptional({ example: 'Implementar checklist de evidências' })
  @IsOptional()
  @IsString()
  acaoCorretiva?: string;

  @ApiPropertyOptional({ enum: StatusNaoConformidade, enumName: 'StatusNaoConformidade' })
  @IsOptional()
  @IsEnum(StatusNaoConformidade, { message: 'Status inválido' })
  status?: StatusNaoConformidade;
}
