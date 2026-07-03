import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { CLASSIFICACAO_KEY, ClassificacaoMetadata } from '../decorators/classificacao.decorator';

@Injectable()
export class ClassificacaoGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const meta = this.reflector.getAllAndOverride<ClassificacaoMetadata>(CLASSIFICACAO_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Rota sem exigência de classificação → liberado
    if (!meta) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return true; // AuthGuard já validou o token

    const entidadeTipo = meta.entidadeTipo;
    const entidadeId = request.params[meta.entidadeIdParam];
    if (!entidadeId) return true;

    const classificacao = await this.prisma.classificacaoDocumento.findFirst({
      where: { entidadeTipo, entidadeId },
    });

    // Sem classificação ou PUBLICO → liberado
    if (!classificacao || classificacao.nivelSigilo === 'PUBLICO') return true;

    // Registrar acesso na trilha
    await this.prisma.logAcessoSigiloso.create({
      data: {
        usuarioId: user.sub,
        entidadeTipo,
        entidadeId,
        acao: 'CONSULTA',
      },
    });

    // SIGILOSO ou RESTRITO: apenas P01, P02 (designados), P03, P10
    const perfis = await this.prisma.usuarioPerfil.findMany({
      where: { usuarioId: user.sub, ativo: true },
      include: { perfil: true },
    });
    const codigos = perfis.map((up) => up.perfil.codigo);

    if (codigos.some((c) => ['P01', 'P02', 'P03', 'P10'].includes(c))) return true;

    throw new ForbiddenException('Acesso negado — documento classificado como sigiloso');
  }
}
