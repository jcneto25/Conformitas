import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateForcaTrabalhoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  planoId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  usuarioId: string;

  @ApiProperty({ minimum: 0, example: 2000 })
  @IsInt()
  @Min(0)
  horasDisponiveisAno: number;

  @ApiProperty({ minimum: 0, example: 2026 })
  @IsInt()
  ano: number;
}
