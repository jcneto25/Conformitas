import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(email: string, senha: string) {
    // PRP-001: Implementação completa do fluxo JWT + MFA
    throw new UnauthorizedException('Módulo de autenticação — implementação pendente (PRP-001)');
  }

  async refresh(token: string) {
    throw new UnauthorizedException('Refresh token — implementação pendente');
  }
}
