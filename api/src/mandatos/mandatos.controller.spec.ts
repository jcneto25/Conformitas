import { Test, TestingModule } from '@nestjs/testing';
import { MandatosController } from './mandatos.controller';
import { MandatosService } from './mandatos.service';

type MockMandatosService = {
  [K in keyof MandatosService]: jest.Mock;
};

describe('MandatosController', () => {
  let controller: MandatosController;
  let service: MockMandatosService;

  beforeEach(async () => {
    const mockService: MockMandatosService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      concluir: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MandatosController],
      providers: [{ provide: MandatosService, useValue: mockService }],
    }).compile();

    controller = module.get<MandatosController>(MandatosController);
    service = module.get(MandatosService) as MockMandatosService;
  });

  describe('POST /mandatos', () => {
    it('deve criar mandato', async () => {
      service.create.mockResolvedValue({
        id: 'mandato-1',
        usuarioId: 'user-1',
        numeroMandato: 1,
        status: 'ATIVO',
      });

      const result = await controller.create({
        usuarioId: 'user-1',
        dataInicio: '2026-01-01',
        dataFimPrevista: '2028-01-01',
        atoDesignacao: 'ATO-001/2026',
      });

      expect(result).toHaveProperty('id');
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('GET /mandatos', () => {
    it('deve listar mandatos', async () => {
      service.findAll.mockResolvedValue([{ id: '1', numeroMandato: 1, status: 'ATIVO' }]);
      const result = await controller.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('GET /mandatos/:id', () => {
    it('deve retornar mandato por ID', async () => {
      service.findOne.mockResolvedValue({ id: '1', numeroMandato: 1 });
      const result = await controller.findOne('1');
      expect(result).toHaveProperty('numeroMandato');
    });
  });

  describe('PATCH /mandatos/:id/concluir', () => {
    it('deve concluir mandato', async () => {
      service.concluir.mockResolvedValue({ id: '1', status: 'CONCLUIDO' });
      const result = await controller.concluir('1');
      expect(result).toHaveProperty('status', 'CONCLUIDO');
    });
  });
});
