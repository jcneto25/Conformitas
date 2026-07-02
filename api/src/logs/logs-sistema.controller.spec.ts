import { Test, TestingModule } from '@nestjs/testing';
import { LogsSistemaController } from './logs-sistema.controller';
import { LogsSistemaService } from './logs-sistema.service';

type MockLogsSistemaService = {
  [K in keyof LogsSistemaService]: jest.Mock;
};

describe('LogsSistemaController', () => {
  let controller: LogsSistemaController;
  let service: MockLogsSistemaService;

  beforeEach(async () => {
    const mockService: MockLogsSistemaService = {
      findAll: jest.fn(),
      registrar: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsSistemaController],
      providers: [{ provide: LogsSistemaService, useValue: mockService }],
    }).compile();

    controller = module.get<LogsSistemaController>(LogsSistemaController);
    service = module.get(LogsSistemaService) as MockLogsSistemaService;
  });

  describe('GET /logs-sistema', () => {
    it('deve listar logs com filtros opcionais', async () => {
      service.findAll.mockResolvedValue({ data: [], total: 0, page: 1, limit: 50, totalPages: 0 });

      const result = await controller.findAll('user-uuid', 'LOGIN_SUCESSO');
      expect(result).toHaveProperty('total', 0);
      expect(service.findAll).toHaveBeenCalledWith({
        usuarioId: 'user-uuid',
        acao: 'LOGIN_SUCESSO',
        dataInicio: undefined,
        dataFim: undefined,
        page: undefined,
        limit: undefined,
      });
    });
  });
});
