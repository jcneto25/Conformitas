import { IsEmail, IsOptional, IsNotEmpty, MinLength, Matches } from 'class-validator';
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

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\]{};':"\\|,.<>/?]).{8,}$/, {
    message: 'Senha deve conter 8+ caracteres com maiúscula, minúscula, número e símbolo',
  })
  senha?: string;
}
