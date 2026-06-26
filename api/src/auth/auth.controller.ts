import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { MfaVerifyDto } from './dto/mfa-verify.dto';
import { MfaSetupDto } from './dto/mfa-setup.dto';
import { Public } from '../common/decorators/public.decorator';

interface RequestWithUser extends Request {
  user: { sub: string; email: string; roles: string[] };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login com email e senha' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.senha);
  }

  @Public()
  @Post('mfa/verify')
  @ApiOperation({ summary: 'Verificar código MFA TOTP' })
  verifyMfa(@Body() dto: MfaVerifyDto) {
    return this.authService.verifyMfa(dto.session_token, dto.totp_code);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Renovar access token' })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refresh_token);
  }

  @Post('mfa/setup')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Configurar MFA TOTP' })
  setupMfa(@Req() req: RequestWithUser, @Body() dto: MfaSetupDto) {
    return this.authService.setupMfa(req.user.sub, dto.senha);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  getProfile(@Req() req: RequestWithUser) {
    return this.authService.getProfile(req.user.sub);
  }
}
