import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaAuthRepository } from './repositories/prisma-auth.repository';
import { AUTH_REPOSITORY } from './repositories/auth.repository';
import appConfig from '../config/app.config';
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({ secret: appConfig.jwt.secret, signOptions: { expiresIn: appConfig.jwt.expiresIn } }),
  ],
  controllers: [AuthController],
  providers: [AuthService, { provide: AUTH_REPOSITORY, useClass: PrismaAuthRepository }],
})
export class AuthModule {}
