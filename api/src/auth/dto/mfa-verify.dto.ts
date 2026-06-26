import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MfaVerifyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  session_token: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  totp_code: string;
}
