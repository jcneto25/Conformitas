import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';

/**
 * Keycloak OIDC Strategy — opcional
 * Ativado quando AUTH_PROVIDER=keycloak.
 * Implementação completa no PRP-001 (extensão OIDC).
 */
@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  private readonly logger = new Logger(KeycloakStrategy.name);

  constructor() {
    super();
    this.logger.warn('Keycloak OIDC Strategy — stub. Implementação pendente (PRP-001 extensão).');
  }

  async validate(payload: any) {
    return { sub: payload.sub, email: payload.email, roles: payload.realm_access?.roles ?? [] };
  }
}
