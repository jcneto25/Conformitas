import { Test, TestingModule } from '@nestjs/testing';
import { DashboardsService } from './dashboards.service';
import { DASHBOARD_REPOSITORY } from './repositories/dashboard.repository';

describe('DashboardsService', () => {
  let service: DashboardsService;
  let repo: any;
  const mockRepo = () => ({
    findPlanosAno: jest.fn(),
    findAuditorias: jest.fn(),
    findRecomendacoes: jest.fn(),
    findAvaliacoesQualidade: jest.fn(),
    findIndicadoresQualidade: jest.fn(),
    findNaoConformidades: jest.fn(),
    findForcaTrabalho: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardsService, { provide: DASHBOARD_REPOSITORY, useValue: mockRepo() }],
    }).compile();
    service = module.get<DashboardsService>(DashboardsService);
    repo = module.get(DASHBOARD_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('dashboardPaa', async () => {
    repo.findPlanosAno.mockResolvedValue([]);
    repo.findAuditorias.mockResolvedValue([]);
    const r = await service.dashboardPaa({});
    expect(r.totalPlanos).toBe(0);
  });
  it('dashboardExecucao', async () => {
    repo.findAuditorias.mockResolvedValue([]);
    const r = await service.dashboardExecucao({});
    expect(r.total).toBe(0);
  });
  it('dashboardRecomendacoes', async () => {
    repo.findRecomendacoes.mockResolvedValue([]);
    const r = await service.dashboardRecomendacoes({});
    expect(r.total).toBe(0);
  });
  it('dashboardQualidade', async () => {
    repo.findAvaliacoesQualidade.mockResolvedValue([]);
    repo.findIndicadoresQualidade.mockResolvedValue([]);
    repo.findNaoConformidades.mockResolvedValue([]);
    const r = await service.dashboardQualidade({});
    expect(r.totalAvaliacoes).toBe(0);
  });
});
