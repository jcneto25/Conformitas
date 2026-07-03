import { Test, TestingModule } from '@nestjs/testing';
import { DashboardsController } from './dashboards.controller';
import { DashboardsService } from './dashboards.service';

describe('DashboardsController', () => {
  let controller: DashboardsController;

  const mockService = {
    dashboardPaa: jest.fn(),
    dashboardExecucao: jest.fn(),
    dashboardRecomendacoes: jest.fn(),
    dashboardQualidade: jest.fn(),
    exportSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardsController],
      providers: [{ provide: DashboardsService, useValue: mockService }],
    }).compile();

    controller = module.get<DashboardsController>(DashboardsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('dashboardPaa', () => {
    it('should call service.dashboardPaa', async () => {
      mockService.dashboardPaa.mockResolvedValue({ totalPlanos: 2 });
      const result = await controller.dashboardPaa({ ano: 2026 });
      expect(result).toEqual({ totalPlanos: 2 });
      expect(mockService.dashboardPaa).toHaveBeenCalledWith({ ano: 2026 });
    });
  });

  describe('dashboardExecucao', () => {
    it('should call service.dashboardExecucao', async () => {
      mockService.dashboardExecucao.mockResolvedValue({ total: 5, porStatus: {} });
      const result = await controller.dashboardExecucao({});
      expect(result.total).toBe(5);
      expect(mockService.dashboardExecucao).toHaveBeenCalled();
    });
  });

  describe('dashboardRecomendacoes', () => {
    it('should call service.dashboardRecomendacoes', async () => {
      mockService.dashboardRecomendacoes.mockResolvedValue({ total: 10, vencidas: 2 });
      const result = await controller.dashboardRecomendacoes({});
      expect(result.vencidas).toBe(2);
    });
  });

  describe('dashboardQualidade', () => {
    it('should call service.dashboardQualidade', async () => {
      mockService.dashboardQualidade.mockResolvedValue({ totalAvaliacoes: 3 });
      const result = await controller.dashboardQualidade({});
      expect(result.totalAvaliacoes).toBe(3);
    });
  });

  describe('health', () => {
    it('should return ok status with pdf and xlsx availability', () => {
      const result = controller.health();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('pdfDisponivel');
      expect(result).toHaveProperty('xlsxDisponivel');
      expect(result).toHaveProperty('timestamp');
    });
  });

  describe('export', () => {
    it('should call exportSummary with correct tipo and formato', async () => {
      const mockRes = { setHeader: jest.fn(), send: jest.fn(), json: jest.fn() };
      mockService.exportSummary.mockResolvedValue({
        tipo: 'paa', formato: 'PDF', dados: { totalPlanos: 5 },
        geradoEm: '2026-01-01', filtros: {},
      });

      await controller.export('paa', 'PDF' as any, {} as any, mockRes as any);
      expect(mockService.exportSummary).toHaveBeenCalledWith('paa', 'PDF', {});
    });
  });
});
