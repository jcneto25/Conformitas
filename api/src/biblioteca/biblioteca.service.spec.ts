import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaService } from './biblioteca.service';
import { DOCUMENTO_REPOSITORY } from './repositories/documento.repository';

describe('BibliotecaService', () => {
  let service: BibliotecaService;
  let repo: any;
  const mockRepo = () => ({
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findByTitulo: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BibliotecaService, { provide: DOCUMENTO_REPOSITORY, useValue: mockRepo() }],
    }).compile();
    service = module.get<BibliotecaService>(BibliotecaService);
    repo = module.get(DOCUMENTO_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create', async () => {
    repo.create.mockResolvedValue({ id: '1', titulo: 'Manual' });
    const r = await service.create({ titulo: 'Manual', tipo: 'MANUAL' } as any);
    expect(r.id).toBe('1');
  });
  it('should findAll', async () => {
    repo.findMany.mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });
  it('should findOne', async () => {
    repo.findUnique.mockResolvedValue({ id: '1', titulo: 'Doc' });
    expect((await service.findOne('1')).titulo).toBe('Doc');
  });
  it('should throw if not found', async () => {
    repo.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toThrow('Documento não encontrado');
  });
});
