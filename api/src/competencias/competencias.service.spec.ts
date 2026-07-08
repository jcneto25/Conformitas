import { Test, TestingModule } from '@nestjs/testing';
import { CompetenciasService } from './competencias.service';
import { COMPETENCIA_REPOSITORY } from './repositories/competencia.repository';

describe('CompetenciasService', () => {
  let service: CompetenciasService;
  let repo: any;
  const mockRepo = () => ({
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompetenciasService, { provide: COMPETENCIA_REPOSITORY, useValue: mockRepo() }],
    }).compile();
    service = module.get<CompetenciasService>(CompetenciasService);
    repo = module.get(COMPETENCIA_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create', async () => {
    repo.create.mockResolvedValue({ id: '1', nome: 'Contabilidade' });
    const r = await service.create({ nome: 'Contabilidade', tipo: 'GESTAO' } as any);
    expect(r.id).toBe('1');
  });
  it('should findAll', async () => {
    repo.findMany.mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });
  it('should findOne', async () => {
    repo.findUnique.mockResolvedValue({ id: '1', nome: 'Teste' });
    expect((await service.findOne('1')).nome).toBe('Teste');
  });
  it('should throw if not found', async () => {
    repo.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toThrow('Competência não encontrada');
  });
});
