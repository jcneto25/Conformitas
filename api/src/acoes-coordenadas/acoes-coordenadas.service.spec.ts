import { Test, TestingModule } from '@nestjs/testing';
import { AcoesCoordenadasService } from './acoes-coordenadas.service';
import { ACAO_COORDENADA_REPOSITORY } from './repositories/acao-coordenada.repository';

describe('AcoesCoordenadasService', () => {
  let service: AcoesCoordenadasService;
  let repo: any;
  const mockRepo = () => ({
    findAll: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcoesCoordenadasService, { provide: ACAO_COORDENADA_REPOSITORY, useValue: mockRepo() }],
    }).compile();
    service = module.get<AcoesCoordenadasService>(AcoesCoordenadasService);
    repo = module.get(ACAO_COORDENADA_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findAll', async () => {
    repo.findAll.mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });
  it('findOne', async () => {
    repo.findUnique.mockResolvedValue({ id: '1' });
    expect((await service.findOne('1')).id).toBe('1');
  });
  it('throw if not found', async () => {
    repo.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toThrow('Ação Coordenada não encontrada');
  });
  it('create', async () => {
    repo.findFirst.mockResolvedValue(null);
    repo.create.mockResolvedValue({ id: '1' });
    const r = await service.create({ codigoSiaud: 'SIAUD-001', titulo: 'Teste' } as any);
    expect(r.id).toBe('1');
  });
});
