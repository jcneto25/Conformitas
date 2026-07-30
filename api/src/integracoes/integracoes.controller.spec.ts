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
      providers: [{ provide: IntegracoesService, useValue: mockService }],
    }).compile();

    controller = module.get<IntegracoesController>(IntegracoesController);
    jest.clearAllMocks();
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

  describe('update', () => {
    it('should call service.update with id and dto', () => {
      mockService.update.mockResolvedValue({ id: '1', nome: 'Updated' });
      controller.update('1', { nome: 'Updated' } as any);
      expect(mockService.update).toHaveBeenCalledWith('1', { nome: 'Updated' });
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', () => {
      mockService.remove.mockResolvedValue({ id: '1' });
      controller.remove('1');
      expect(mockService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('healthCheck', () => {
    it('should call service.healthCheck with id', () => {
      mockService.healthCheck.mockResolvedValue({ healthStatus: 'ONLINE' });
      controller.healthCheck('1');
      expect(mockService.healthCheck).toHaveBeenCalledWith('1');
    });
  });

  describe('healthAll', () => {
    it('should call service.healthAll', () => {
      mockService.healthAll.mockResolvedValue([]);
      controller.healthAll();
      expect(mockService.healthAll).toHaveBeenCalled();
    });
  });

  describe('logs', () => {
    it('should call service.logs with id', () => {
      mockService.logs.mockResolvedValue([]);
      controller.logs('1');
      expect(mockService.logs).toHaveBeenCalledWith('1');
    });
  });
});