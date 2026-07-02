import { IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Admin@123456' })
  @IsNotEmpty()
  senha_atual: string;

  @ApiProperty({ example: 'Nova@123456' })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\]{};':"\\|,.<>/?]).{8,}$/, {
    message: 'Senha deve conter 8+ caracteres com maiúscula, minúscula, número e símbolo',
  })
  nova_senha: string;
}
