import { Controller, Get, Patch, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { NotificacoesService } from './notificacoes.service';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser extends Request {
  user: { sub: string; email: string; roles: string[] };
}

@ApiTags('notificacoes')
@Controller('notificacoes')
@ApiBearerAuth()
export class NotificacoesController {
  constructor(private readonly service: NotificacoesService) {}

  @Get()
  @Roles('P01', 'P02', 'P03', 'P05')
  @ApiOperation({ summary: 'Listar notificações do usuário logado' })
  listar(@Req() req: RequestWithUser) {
    return this.service.listar(req.user.sub);
  }

  @Get('nao-lidas')
  @Roles('P01', 'P02', 'P03', 'P05')
  @ApiOperation({ summary: 'Listar notificações não lidas do usuário' })
  listarNaoLidas(@Req() req: RequestWithUser) {
    return this.service.listarNaoLidas(req.user.sub);
  }

  @Patch(':id/ler')
  @Roles('P01', 'P02', 'P03', 'P05')
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  marcarLida(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.service.marcarLida(id, req.user.sub);
  }
}
