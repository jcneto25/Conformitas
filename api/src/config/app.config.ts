import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

export default {
  jwt: {
    secret: config.get('JWT_SECRET') || 'dev-jwt-secret-change-in-production',
    expiresIn: config.get('JWT_EXPIRES_IN') || '1800',
    refreshExpiresIn: config.get('REFRESH_EXPIRES_IN') || '28800',
  },
  totp: {
    issuer: config.get('TOTP_ISSUER') || 'CONFORMITAS-DEV',
  },
  auth: {
    provider: config.get('AUTH_PROVIDER') || 'local',
    keycloak: {
      url: config.get('KEYCLOAK_URL'),
      realm: config.get('KEYCLOAK_REALM') || 'conformitas',
      clientId: config.get('KEYCLOAK_CLIENT_ID') || 'conformitas-api',
      clientSecret: config.get('KEYCLOAK_CLIENT_SECRET'),
    },
  },
  upload: {
    maxSize: config.get('UPLOAD_MAX_SIZE') || '25mb',
    dir: config.get('UPLOAD_DIR') || './uploads',
  },
};
