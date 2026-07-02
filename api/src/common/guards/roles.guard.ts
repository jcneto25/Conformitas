import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user || !user.roles) {
      this.logger.warn(`403 — Perfil não identificado — ${request.method} ${request.url}`);
      throw new ForbiddenException('Acesso negado — perfil não identificado');
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      this.logger.warn(
        `403 — Perfil insuficiente — ${request.method} ${request.url} — user=${user.sub} roles=${user.roles} required=${requiredRoles}`,
      );
      throw new ForbiddenException('Acesso negado — perfil insuficiente');
    }

    return true;
  }
}
