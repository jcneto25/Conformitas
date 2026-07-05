import { Test, TestingModule } from '@nestjs/testing';
import { RiscosController } from './riscos.controller';
import { RiscosService } from './riscos.service';

describe('RiscosController', () => {
  let controller: RiscosController;
  let service: any;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    matrizRiscos: jest.fn(),
    resumoPorCategoria: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiscosController],
      providers: [{ provide: RiscosService, useValue: mockService }],
    }).compile();
    controller = module.get<RiscosController>(RiscosController);
    service = module.get(RiscosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should delegate to service', async () => {
    const dto = { codigo: 'R001', descricao: 'Teste', probabilidade: 3, impacto: 4, status: 'IDENTIFICADO' };
    mockService.create.mockResolvedValue({ id: '1', ...dto, nivel: 'ALTO' });
    expect(await controller.create(dto)).toEqual({ id: '1', ...dto, nivel: 'ALTO' });
  });

  it('findAll should delegate to service', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll();
    expect(mockService.findAll).toHaveBeenCalledWith({ categoria: undefined, status: undefined, nivel: undefined });
  });

  it('findOne should delegate to service', async () => {
    mockService.findOne.mockResolvedValue({ id: '1' });
    expect(await controller.findOne('1')).toEqual({ id: '1' });
  });

  it('matriz should delegate to service', async () => {
    mockService.matrizRiscos.mockResolvedValue({ riscos: [], agrupado: {}, total: 0 });
    const result = await controller.matriz();
    expect(result.total).toBe(0);
  });

  it('resumoPorCategoria should delegate to service', async () => {
    mockService.resumoPorCategoria.mockResolvedValue([]);
    await controller.resumoPorCategoria();
    expect(mockService.resumoPorCategoria).toHaveBeenCalled();
  });

  it('update should delegate to service', async () => {
    mockService.update.mockResolvedValue({ id: '1' });
    await controller.update('1', { descricao: 'Novo' });
    expect(mockService.update).toHaveBeenCalledWith('1', { descricao: 'Novo' });
  });

  it('remove should delegate to service', async () => {
    mockService.remove.mockResolvedValue({ id: '1' });
    await controller.remove('1');
    expect(mockService.remove).toHaveBeenCalledWith('1');
  });
});
