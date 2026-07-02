import { Test, TestingModule } from '@nestjs/testing';
import { NotificacoesController } from './notificacoes.controller';
import { NotificacoesService } from './notificacoes.service';

const mockReq = (sub = 'user-1') => ({
  user: { sub, email: 'test@test.com', roles: ['P05'] },
}) as any;

describe('NotificacoesController', () => {
  let controller: NotificacoesController;
  let service: jest.Mocked<Pick<NotificacoesService, 'listar' | 'listarNaoLidas' | 'marcarLida'>>;

  beforeEach(async () => {
    service = {
      listar: jest.fn(),
      listarNaoLidas: jest.fn(),
      marcarLida: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificacoesController],
      providers: [{ provide: NotificacoesService, useValue: service }],
    }).compile();

    controller = module.get<NotificacoesController>(NotificacoesController);
  });

  describe('GET /notificacoes', () => {
    it('deve listar notificações do usuário logado', async () => {
      service.listar.mockResolvedValue([{ id: 'not-1' } as any]);
      const result = await controller.listar(mockReq());
      expect(result).toHaveLength(1);
      expect(service.listar).toHaveBeenCalledWith('user-1');
    });
  });

  describe('GET /notificacoes/nao-lidas', () => {
    it('deve listar não lidas', async () => {
      service.listarNaoLidas.mockResolvedValue([{ id: 'not-1', lida: false } as any]);
      const result = await controller.listarNaoLidas(mockReq());
      expect(result).toHaveLength(1);
      expect(service.listarNaoLidas).toHaveBeenCalledWith('user-1');
    });
  });

  describe('PATCH /notificacoes/:id/ler', () => {
    it('deve marcar notificação como lida', async () => {
      service.marcarLida.mockResolvedValue({ count: 1 } as any);
      const result = await controller.marcarLida(mockReq(), 'not-1');
      expect(result).toBeDefined();
      expect(service.marcarLida).toHaveBeenCalledWith('not-1', 'user-1');
    });
  });
});
