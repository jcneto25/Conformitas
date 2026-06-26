import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarRequisicaoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ minimum: 1, example: 10 })
  @IsInt()
  @Min(1)
  prazoDias: number;
}
