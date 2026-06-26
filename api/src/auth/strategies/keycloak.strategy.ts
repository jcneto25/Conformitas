import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import appConfig from '../../config/app.config';

/**
 * Keycloak OIDC Strategy — valida tokens JWT emitidos pelo Keycloak
 * usando o JWKS endpoint (RS256). Ativado quando AUTH_PROVIDER=keycloak.
 *
 * Tokens são validados criptograficamente contra a chave pública do realm.
 */
@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  private readonly logger = new Logger(KeycloakStrategy.name);

  constructor() {
    const keycloakUrl = appConfig.auth.keycloak.url;
    const realm = appConfig.auth.keycloak.realm;

    // Se não configurado, registra como stub (não será usado se AUTH_PROVIDER=local)
    if (!keycloakUrl) {
      super({ 
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
        secretOrKey: 'stub' 
      });
      Logger.warn('KEYCLOAK_URL não configurada — KeycloakStrategy registrada como stub', 'KeycloakStrategy');
      return;
    }

    const jwksUri = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
      }),
      issuer: `${keycloakUrl}/realms/${realm}`,
      algorithms: ['RS256'],
    });

    this.logger.log(`Keycloak OIDC Strategy inicializada — realm: ${realm}`);
  }

  async validate(payload: any) {
    if (!payload.sub) {
      this.logger.warn('Token JWT sem sub claim — rejeitado');
      throw new UnauthorizedException('Token inválido: sub ausente');
    }

    const clientId = appConfig.auth.keycloak.clientId;

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name || payload.preferred_username,
      realmRoles: payload.realm_access?.roles ?? [],
      clientRoles: payload.resource_access?.[clientId]?.roles ?? [],
      sessionState: payload.session_state,
    };
  }
}
