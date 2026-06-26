import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'João Silva' })
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'joao.silva@audin.tjce.gov.br' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'AUD001' })
  @IsNotEmpty()
  matricula: string;

  @ApiProperty({ example: 'Auditor' })
  @IsNotEmpty()
  cargo: string;

  @ApiProperty({ example: 'AUDIN' })
  @IsNotEmpty()
  unidade: string;

  @ApiProperty({ example: 'Admin@123456' })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\]{};':"\\|,.<>/?]).{8,}$/, {
    message: 'Senha deve conter 8+ caracteres com maiúscula, minúscula, número e símbolo',
  })
  senha: string;
}
