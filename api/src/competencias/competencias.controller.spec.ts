import { Test, TestingModule } from '@nestjs/testing';
import { CompetenciasController } from './competencias.controller';
import { CompetenciasService } from './competencias.service';

describe('CompetenciasController', () => {
  let controller: CompetenciasController;
  let service: any;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetenciasController],
      providers: [{ provide: CompetenciasService, useValue: mockService }],
    }).compile();
    controller = module.get<CompetenciasController>(CompetenciasController);
    service = module.get(CompetenciasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should delegate to service', async () => {
    const dto = { nome: 'Auditoria', tipo: 'TECNICA' };
    mockService.create.mockResolvedValue({ id: '1', ...dto });
    expect(await controller.create(dto)).toEqual({ id: '1', ...dto });
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('findAll should delegate to service', async () => {
    mockService.findAll.mockResolvedValue([]);
    expect(await controller.findAll()).toEqual([]);
    expect(mockService.findAll).toHaveBeenCalledWith({ tipo: undefined });
  });

  it('findOne should delegate to service', async () => {
    mockService.findOne.mockResolvedValue({ id: '1' });
    expect(await controller.findOne('1')).toEqual({ id: '1' });
    expect(mockService.findOne).toHaveBeenCalledWith('1');
  });

  it('update should delegate to service', async () => {
    mockService.update.mockResolvedValue({ id: '1', nome: 'Updated' });
    expect(await controller.update('1', { nome: 'Updated' })).toEqual({ id: '1', nome: 'Updated' });
    expect(mockService.update).toHaveBeenCalledWith('1', { nome: 'Updated' });
  });

  it('remove should delegate to service', async () => {
    mockService.remove.mockResolvedValue({ id: '1' });
    expect(await controller.remove('1')).toEqual({ id: '1' });
    expect(mockService.remove).toHaveBeenCalledWith('1');
  });
});
