import { Test, TestingModule } from '@nestjs/testing';
import { RiscosService } from './riscos.service';
import { RISCO_REPOSITORY } from './repositories/risco.repository';

describe('RiscosService', () => {
  let service: RiscosService;
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
      providers: [RiscosService, { provide: RISCO_REPOSITORY, useValue: mockRepo() }],
    }).compile();
    service = module.get<RiscosService>(RiscosService);
    repo = module.get(RISCO_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create risco with nivel', async () => {
    const dto = { nome: 'Risco 1', probabilidade: 4, impacto: 4, categoria: 'OPERACIONAL' };
    repo.create.mockResolvedValue({ id: '1', ...dto, nivel: 'ALTO' });
    const r = await service.create(dto as any);
    expect(r.nivel).toBe('ALTO');
  });
  it('should findAll', async () => {
    repo.findMany.mockResolvedValue([{ id: '1' }]);
    expect(await service.findAll()).toHaveLength(1);
  });
  it('should findOne', async () => {
    repo.findUnique.mockResolvedValue({ id: '1', nome: 'Risco' });
    expect((await service.findOne('1')).nome).toBe('Risco');
  });
  it('should throw if not found', async () => {
    repo.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toThrow('Risco não encontrado');
  });
  it('should matrizRiscos', async () => {
    repo.findMany.mockResolvedValue([{ nivel: 'ALTO' }, { nivel: 'BAIXO' }]);
    const m = await service.matrizRiscos();
    expect(m.total).toBe(2);
    expect(m.agrupado.ALTO).toBe(1);
  });
});
