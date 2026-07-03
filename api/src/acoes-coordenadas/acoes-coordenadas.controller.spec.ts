import { Test, TestingModule } from '@nestjs/testing';
import { AcoesCoordenadasController } from './acoes-coordenadas.controller';
import { AcoesCoordenadasService } from './acoes-coordenadas.service';

describe('AcoesCoordenadasController', () => {
  let controller: AcoesCoordenadasController;
  let service: any;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    reportarResultado: jest.fn(),
    webhookReceber: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcoesCoordenadasController],
      providers: [{ provide: AcoesCoordenadasService, useValue: mockService }],
    }).compile();

    controller = module.get<AcoesCoordenadasController>(AcoesCoordenadasController);
    service = mockService;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should delegate to service.findAll', async () => {
      const mock = [{ id: '1' }];
      service.findAll.mockResolvedValue(mock);
      expect(await controller.findAll()).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne', async () => {
      const mock = { id: '1' };
      service.findOne.mockResolvedValue(mock);
      expect(await controller.findOne('1')).toEqual(mock);
    });
  });

  describe('create', () => {
    it('should delegate to service.create', async () => {
      const mock = { id: '1' };
      service.create.mockResolvedValue(mock);
      expect(await controller.create({ codigoSiaud: 'S-001', titulo: 'Test' } as any)).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should delegate to service.update', async () => {
      const mock = { id: '1' };
      service.update.mockResolvedValue(mock);
      expect(await controller.update('1', {} as any)).toEqual(mock);
    });
  });

  describe('reportar', () => {
    it('should delegate to service.reportarResultado', async () => {
      const mock = { status: 'REPORTADA' };
      service.reportarResultado.mockResolvedValue(mock);
      expect(await controller.reportar('1', { auditoriaId: 'aud-1' })).toEqual(mock);
    });
  });

  describe('webhook', () => {
    it('should delegate to service.webhookReceber', async () => {
      const mock = { status: 'RECEBIDA' };
      service.webhookReceber.mockResolvedValue(mock);
      expect(await controller.webhook({ codigoSiaud: 'S-001', titulo: 'Test' } as any)).toEqual(mock);
    });
  });
});
