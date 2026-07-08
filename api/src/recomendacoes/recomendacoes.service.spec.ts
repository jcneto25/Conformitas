import { Test, TestingModule } from '@nestjs/testing';
import { RecomendacoesService } from './recomendacoes.service';
import { RECOMENDACAO_REPOSITORY, PROVIDENCIA_REPOSITORY } from './repositories/recomendacao.repository';

describe('RecomendacoesService', () => {
  let service: RecomendacoesService;
  let recRepo: any;
  let provRepo: any;
  const mockRepo = () => ({ create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecomendacoesService,
        { provide: RECOMENDACAO_REPOSITORY, useValue: mockRepo() },
        { provide: PROVIDENCIA_REPOSITORY, useValue: { create: jest.fn(), findMany: jest.fn() } },
      ],
    }).compile();
    service = module.get<RecomendacoesService>(RecomendacoesService);
    recRepo = module.get(RECOMENDACAO_REPOSITORY);
    provRepo = module.get(PROVIDENCIA_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('criar', async () => {
    recRepo.create.mockResolvedValue({ id: '1' });
    expect((await service.criar('rel-1', { descricao: 'Melhorar' })).id).toBe('1');
  });
  it('findAll', async () => {
    recRepo.findMany.mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });
  it('findOne', async () => {
    recRepo.findUnique.mockResolvedValue({ id: '1' });
    expect((await service.findOne('1')).id).toBe('1');
  });
  it('criarProvidencia', async () => {
    provRepo.create.mockResolvedValue({ id: '1' });
    expect((await service.criarProvidencia('rec-1', { descricao: 'Ação' })).id).toBe('1');
  });
  it('verificarVencidas', async () => {
    recRepo.findMany.mockResolvedValue([{ id: '1' }]);
    recRepo.update.mockResolvedValue({});
    expect((await service.verificarVencidas()).vencidas).toBe(1);
  });
});
