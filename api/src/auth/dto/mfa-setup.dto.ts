import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MfaSetupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  senha: string;
}
