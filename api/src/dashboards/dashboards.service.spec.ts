import { Test, TestingModule } from '@nestjs/testing';
import { DashboardsService } from './dashboards.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardsService', () => {
  let service: DashboardsService;

  const mockPrisma = {
    planoAuditoria: { findMany: jest.fn() },
    auditoria: { findMany: jest.fn() },
    recomendacao: { findMany: jest.fn() },
    avaliacaoQualidade: { findMany: jest.fn() },
    indicadorQualidade: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardsService>(DashboardsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('dashboardPaa', () => {
    it('should return aggregated PAA data', async () => {
      mockPrisma.planoAuditoria.findMany.mockResolvedValue([]);
      mockPrisma.auditoria.findMany.mockResolvedValue([]);

      const result = await service.dashboardPaa({ ano: 2026 });
      expect(result).toHaveProperty('totalPlanos');
      expect(result).toHaveProperty('planejamentoPercentual');
    });
  });

  describe('dashboardExecucao', () => {
    it('should return aggregated execution data', async () => {
      mockPrisma.auditoria.findMany.mockResolvedValue([
        { status: 'EM_EXECUCAO', tipo: 'OPERACIONAL', unidadeAuditada: 'U1' },
        { status: 'CONCLUIDA', tipo: 'OPERACIONAL', unidadeAuditada: 'U2' },
      ]);

      const result = await service.dashboardExecucao({});
      expect(result.total).toBe(2);
      expect(result.porStatus).toHaveProperty('EM_EXECUCAO');
      expect(result.porStatus).toHaveProperty('CONCLUIDA');
    });
  });

  describe('dashboardRecomendacoes', () => {
    it('should return aggregated recommendations data', async () => {
      mockPrisma.recomendacao.findMany.mockResolvedValue([
        { status: 'PENDENTE', criticidade: 'ALTA', prazo: new Date(Date.now() - 86400000) },
        { status: 'CUMPRIDA', criticidade: 'MEDIA', prazo: new Date(Date.now() + 86400000) },
      ]);

      const result = await service.dashboardRecomendacoes({});
      expect(result.total).toBe(2);
      expect(result.vencidas).toBe(1);
    });
  });

  describe('dashboardQualidade', () => {
    it('should return aggregated quality data', async () => {
      mockPrisma.avaliacaoQualidade.findMany.mockResolvedValue([]);
      mockPrisma.indicadorQualidade.findMany.mockResolvedValue([]);

      const result = await service.dashboardQualidade({});
      expect(result).toHaveProperty('totalAvaliacoes');
      expect(result).toHaveProperty('indicadores');
    });
  });
});
