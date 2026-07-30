import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
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
      providers: [DashboardsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<DashboardsService>(DashboardsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('dashboardPaa', () => {
    it('should return aggregated PAA data with empty data', async () => {
      mockPrisma.planoAuditoria.findMany.mockResolvedValue([]);
      mockPrisma.auditoria.findMany.mockResolvedValue([]);

      const result = await service.dashboardPaa({ ano: 2026 });
      expect(result).toHaveProperty('totalPlanos', 0);
      expect(result).toHaveProperty('planejamentoPercentual', 0);
    });

    it('should calculate planejamentoPercentual correctly', async () => {
      mockPrisma.planoAuditoria.findMany.mockResolvedValue([{
        status: 'APROVADO', anoInicio: 2026, anoFim: 2026,
        itensPlano: [], forcTrabalho: [{ horasDisponiveisAno: 1000, horasAlocadasAuditoria: 750 }],
      }]);
      mockPrisma.auditoria.findMany.mockResolvedValue([]);

      const result = await service.dashboardPaa({ ano: 2026 });
      expect(result.totalPlanos).toBe(1);
      expect(result.planosAprovados).toBe(1);
      expect(result.planejamentoPercentual).toBe(75);
    });

    it('should filter auditorias by periodoInicio e periodoFim', async () => {
      mockPrisma.planoAuditoria.findMany.mockResolvedValue([]);
      mockPrisma.auditoria.findMany.mockResolvedValue([]);

      await service.dashboardPaa({ periodoInicio: '2026-01-01', periodoFim: '2026-12-31' });
      const callArgs = mockPrisma.auditoria.findMany.mock.calls[0][0];
      expect(callArgs.where.dataFimReal).toBeDefined();
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

    it('should filter by unidade', async () => {
      mockPrisma.auditoria.findMany.mockResolvedValue([]);
      await service.dashboardExecucao({ unidade: 'U1' });
      const callArgs = mockPrisma.auditoria.findMany.mock.calls[0][0];
      expect(callArgs.where.unidadeAuditada).toBe('U1');
    });

    it('should handle auditorias without unidadeAuditada', async () => {
      mockPrisma.auditoria.findMany.mockResolvedValue([
        { status: 'CONCLUIDA', tipo: 'OPERACIONAL', unidadeAuditada: null },
      ]);
      const result = await service.dashboardExecucao({});
      expect(result.total).toBe(1);
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

    it('should count vencidas only when not CUMPRIDA and prazo passed', async () => {
      mockPrisma.recomendacao.findMany.mockResolvedValue([
        { status: 'CUMPRIDA', criticidade: 'ALTA', prazo: new Date(Date.now() - 86400000) },
      ]);

      const result = await service.dashboardRecomendacoes({});
      expect(result.vencidas).toBe(0);
    });

    it('should handle empty recomendacoes', async () => {
      mockPrisma.recomendacao.findMany.mockResolvedValue([]);
      const result = await service.dashboardRecomendacoes({});
      expect(result.total).toBe(0);
      expect(result.vencidas).toBe(0);
    });
  });

  describe('dashboardQualidade', () => {
    it('should return aggregated quality data with no data', async () => {
      mockPrisma.avaliacaoQualidade.findMany.mockResolvedValue([]);
      mockPrisma.indicadorQualidade.findMany.mockResolvedValue([]);

      const result = await service.dashboardQualidade({});
      expect(result).toHaveProperty('totalAvaliacoes', 0);
      expect(result).toHaveProperty('indicadores', []);
      expect(result.mediaNota).toBeNull();
    });

    it('should calculate mediaNota from concluded avaliacoes', async () => {
      mockPrisma.avaliacaoQualidade.findMany.mockResolvedValue([
        { status: 'CONCLUIDA', nota: 8, naoConformidades: [] },
        { status: 'CONCLUIDA', nota: 6, naoConformidades: [] },
      ]);
      mockPrisma.indicadorQualidade.findMany.mockResolvedValue([]);

      const result = await service.dashboardQualidade({});
      expect(result.mediaNota).toBe(7);
    });

    it('should include naoConformidades count', async () => {
      mockPrisma.avaliacaoQualidade.findMany.mockResolvedValue([
        { status: 'CONCLUIDA', nota: 8, naoConformidades: [{ status: 'ABERTA' }, { status: 'CORRIGIDA' }] },
      ]);
      mockPrisma.indicadorQualidade.findMany.mockResolvedValue([]);

      const result = await service.dashboardQualidade({});
      expect(result.totalNaoConformidades).toBe(2);
      expect(result.naoConformidadesAbertas).toBe(1);
    });
  });

  describe('exportSummary', () => {
    it('should return structured data for paa', async () => {
      mockPrisma.planoAuditoria.findMany.mockResolvedValue([]);
      mockPrisma.auditoria.findMany.mockResolvedValue([]);

      const result = await service.exportSummary('paa', 'XLSX', { ano: 2026 });
      expect(result).toHaveProperty('tipo', 'paa');
      expect(result).toHaveProperty('formato', 'XLSX');
      expect(result).toHaveProperty('dados');
    });

    it('should return structured data for execucao', async () => {
      mockPrisma.auditoria.findMany.mockResolvedValue([]);
      const result = await service.exportSummary('execucao', 'PDF', {});
      expect(result.tipo).toBe('execucao');
    });

    it('should return structured data for recomendacoes', async () => {
      mockPrisma.recomendacao.findMany.mockResolvedValue([]);
      const result = await service.exportSummary('recomendacoes', 'PDF', {});
      expect(result.tipo).toBe('recomendacoes');
    });

    it('should return structured data for qualidade', async () => {
      mockPrisma.avaliacaoQualidade.findMany.mockResolvedValue([]);
      mockPrisma.indicadorQualidade.findMany.mockResolvedValue([]);
      const result = await service.exportSummary('qualidade', 'PDF', {});
      expect(result.tipo).toBe('qualidade');
    });

    it('should throw BadRequestException for invalid tipo', async () => {
      await expect(service.exportSummary('invalido', 'PDF', {})).rejects.toThrow(BadRequestException);
    });
  });
});