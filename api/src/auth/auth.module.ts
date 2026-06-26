import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { KeycloakStrategy } from './strategies/keycloak.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import appConfig from '../config/app.config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: appConfig.auth.provider }),
    JwtModule.register({
      secret: appConfig.jwt.secret,
      signOptions: { expiresIn: appConfig.jwt.expiresIn },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, KeycloakStrategy],
  exports: [AuthService],
})
export class AuthModule {}
