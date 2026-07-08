import { Test, TestingModule } from '@nestjs/testing';
import { UniversoService } from './universo.service';
import { UNIVERSO_AUDITAVEL_REPOSITORY } from './repositories/universo-auditavel.repository';

describe('UniversoService', () => {
  let service: UniversoService;
  let repo: any;
  const mockRepo = () => ({ create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniversoService, { provide: UNIVERSO_AUDITAVEL_REPOSITORY, useValue: mockRepo() }],
    }).compile();
    service = module.get<UniversoService>(UniversoService);
    repo = module.get(UNIVERSO_AUDITAVEL_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create with indicePriorizacao', async () => {
    const dto = {
      nome: 'Unidade X',
      materialidade: 5,
      relevancia: 5,
      criticidade: 5,
      risco: 5,
      tipo: 'UNIDADE',
      unidadeResponsavel: 'SEC',
    };
    repo.create.mockResolvedValue({ id: '1', indicePriorizacao: 5 });
    const r = await service.create(dto as any);
    expect(r.id).toBe('1');
  });
  it('should findAll', async () => {
    repo.findMany.mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });
  it('should findOne', async () => {
    repo.findUnique.mockResolvedValue({ id: '1', nome: 'U' });
    expect((await service.findOne('1')).nome).toBe('U');
  });
  it('should throw if not found', async () => {
    repo.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toThrow();
  });
});
