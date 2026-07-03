import { Test, TestingModule } from '@nestjs/testing';
import { CapacitacoesController } from './capacitacoes.controller';
import { CapacitacoesService } from './capacitacoes.service';

describe('CapacitacoesController', () => {
  let controller: CapacitacoesController;
  let service: any;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    totalizarHoras: jest.fn(),
    alertaMeta: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CapacitacoesController],
      providers: [{ provide: CapacitacoesService, useValue: mockService }],
    }).compile();
    controller = module.get<CapacitacoesController>(CapacitacoesController);
    service = module.get(CapacitacoesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should delegate', async () => {
    const dto = { titulo: 'Curso', cargaHoraria: 20, tipo: 'CURSO', dataInicio: '2026-03-01', participanteIds: ['u1'] };
    mockService.create.mockResolvedValue({ id: '1' });
    expect(await controller.create(dto as any)).toEqual({ id: '1' });
  });

  it('findAll should delegate', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('totalizar should delegate', async () => {
    mockService.totalizarHoras.mockResolvedValue({ horasRealizadas: 35 });
    const result = await controller.totalizar('user-1', '2026');
    expect(result.horasRealizadas).toBe(35);
    expect(mockService.totalizarHoras).toHaveBeenCalledWith('user-1', 2026);
  });

  it('alerta should delegate (RF-012.3)', async () => {
    mockService.alertaMeta.mockResolvedValue({ alerta: 'Meta de 40h/ano: faltam 25h' });
    const result = await controller.alerta('user-1');
    expect(result.alerta).toContain('40h');
    expect(mockService.alertaMeta).toHaveBeenCalledWith('user-1');
  });

  it('findOne should delegate', async () => {
    mockService.findOne.mockResolvedValue({ id: '1' });
    expect(await controller.findOne('1')).toEqual({ id: '1' });
  });

  it('update should delegate', async () => {
    mockService.update.mockResolvedValue({ id: '1' });
    await controller.update('1', { titulo: 'Novo' });
    expect(mockService.update).toHaveBeenCalledWith('1', { titulo: 'Novo' });
  });

  it('remove should delegate', async () => {
    mockService.remove.mockResolvedValue({ id: '1' });
    await controller.remove('1');
    expect(mockService.remove).toHaveBeenCalledWith('1');
  });
});
