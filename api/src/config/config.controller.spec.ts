import { Test, TestingModule } from '@nestjs/testing';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

type MockConfigService = {
  [K in keyof ConfigService]: jest.Mock;
};

describe('ConfigController', () => {
  let controller: ConfigController;
  let service: MockConfigService;

  beforeEach(async () => {
    const mockService: MockConfigService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      getValor: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigController],
      providers: [{ provide: ConfigService, useValue: mockService }],
    }).compile();

    controller = module.get<ConfigController>(ConfigController);
    service = module.get(ConfigService) as MockConfigService;
  });

  describe('GET /configuracoes', () => {
    it('deve listar configurações', async () => {
      service.findAll.mockResolvedValue([{ chave: 'prazo_manifestacao', valor: '5' }]);

      const result = await controller.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('GET /configuracoes/:chave', () => {
    it('deve retornar configuração por chave', async () => {
      service.findOne.mockResolvedValue({ chave: 'prazo_manifestacao', valor: '5' });

      const result = await controller.findOne('prazo_manifestacao');
      expect(result).toHaveProperty('valor');
    });
  });

  describe('PUT /configuracoes/:chave', () => {
    it('deve atualizar configuração', async () => {
      service.update.mockResolvedValue({ chave: 'prazo_manifestacao', valor: '7' });

      const result = await controller.update('prazo_manifestacao', { valor: '7' });
      expect(result.valor).toBe('7');
    });
  });
});
