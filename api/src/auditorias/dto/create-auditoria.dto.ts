import { IsString, IsNotEmpty, IsOptional, IsIn, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuditoriaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemPlanoId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  sigilosa?: boolean;
}
