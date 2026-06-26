import { IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsuarioDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  nome?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  cargo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  unidade?: string;
}
