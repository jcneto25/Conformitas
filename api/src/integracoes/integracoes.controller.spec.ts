import { Test, TestingModule } from '@nestjs/testing';
import { IntegracoesController } from './integracoes.controller';
import { IntegracoesService } from './integracoes.service';

describe('IntegracoesController', () => {
  let controller: IntegracoesController;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    healthCheck: jest.fn(),
    healthAll: jest.fn(),
    logs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntegracoesController],
      providers: [
        { provide: IntegracoesService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<IntegracoesController>(IntegracoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll()', () => {
      mockService.findAll.mockReturnValue([{ id: '1' }]);
      expect(controller.findAll()).toEqual([{ id: '1' }]);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', () => {
      mockService.findOne.mockResolvedValue({ id: 'abc-123' });
      controller.findOne('abc-123');
      expect(mockService.findOne).toHaveBeenCalledWith('abc-123');
    });
  });

  describe('create', () => {
    it('should call service.create with dto', () => {
      const dto = { nome: 'Test', sistemaExterno: 'T', tipo: 'ENTRADA', protocolo: 'REST', status: 'EM_CONFIGURACAO' };
      controller.create(dto as any);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });
});
