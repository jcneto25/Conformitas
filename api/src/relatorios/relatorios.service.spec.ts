import { Test, TestingModule } from '@nestjs/testing';
import { RelatoriosService } from './relatorios.service';
import { RELATORIO_REPOSITORY, RELATORIO_ANUAL_REPOSITORY } from './repositories/relatorio.repository';

describe('RelatoriosService', () => {
  let service: RelatoriosService;
  let relRepo: any;
  let anualRepo: any;
  const mockRepo = () => ({ create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelatoriosService,
        { provide: RELATORIO_REPOSITORY, useValue: mockRepo() },
        { provide: RELATORIO_ANUAL_REPOSITORY, useValue: { create: jest.fn(), findUnique: jest.fn() } },
      ],
    }).compile();
    service = module.get<RelatoriosService>(RelatoriosService);
    relRepo = module.get(RELATORIO_REPOSITORY);
    anualRepo = module.get(RELATORIO_ANUAL_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findOne', async () => {
    relRepo.findUnique.mockResolvedValue({ id: '1' });
    expect((await service.findOne('1')).id).toBe('1');
  });
  it('findAll', async () => {
    relRepo.findMany.mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });
  it('assinar', async () => {
    relRepo.findUnique.mockResolvedValue({ id: '1' });
    relRepo.update.mockResolvedValue({ id: '1', status: 'ASSINADO' });
    expect((await service.assinar('1', 'u1')).status).toBe('ASSINADO');
  });
  it('gerarAnual', async () => {
    anualRepo.findUnique.mockResolvedValue(null);
    anualRepo.create.mockResolvedValue({ id: '1' });
    expect((await service.gerarAnual(2026, 'u1')).id).toBe('1');
  });
  it('gerar relatorio', async () => {
    relRepo.findUnique.mockResolvedValue({ id: 'aud-1', status: 'EM_EXECUCAO' });
    relRepo.findMany.mockResolvedValue([]);
    relRepo.create.mockResolvedValue({ id: 'rel-1', tipo: 'FINAL', status: 'RASCUNHO' });
    const r = await service.gerar('aud-1', { tipo: 'FINAL', autorId: 'u1' });
    expect(r.id).toBe('rel-1');
  });
});
