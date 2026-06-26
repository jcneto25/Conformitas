import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeclaracaoDto {
  @ApiProperty({ example: 2026 })
  @IsInt()
  ano: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  declaracao?: string;
}
