import { IsString, IsNotEmpty, IsIn, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlanoDto {
  @ApiProperty({ enum: ['PALP', 'PAA'] })
  @IsString()
  @IsIn(['PALP', 'PAA'])
  tipo: string;

  @ApiProperty({ example: 2025 })
  @IsInt()
  anoInicio: number;

  @ApiProperty({ example: 2028 })
  @IsInt()
  anoFim: number;
}
