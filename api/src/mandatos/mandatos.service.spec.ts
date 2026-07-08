import { Test, TestingModule } from '@nestjs/testing';
import { MandatosService } from './mandatos.service';
import { MANDATO_AUDITOR_CHEFE_REPOSITORY } from './repositories/mandato-auditor-chefe.repository';

describe('MandatosService', () => {
  let service: MandatosService;
  let repo: any;
  const mockRepo = () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findUnique: jest.fn(),
    findByUsuario: jest.fn(),
    update: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MandatosService, { provide: MANDATO_AUDITOR_CHEFE_REPOSITORY, useValue: mockRepo() }],
    }).compile();
    service = module.get<MandatosService>(MandatosService);
    repo = module.get(MANDATO_AUDITOR_CHEFE_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should findAll', async () => {
    repo.findAll.mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });
  it('should findOne', async () => {
    repo.findUnique.mockResolvedValue({ id: '1' });
    expect((await service.findOne('1')).id).toBe('1');
  });
  it('should throw if not found', async () => {
    repo.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toThrow('Mandato não encontrado');
  });
  it('should create mandato', async () => {
    repo.findByUsuario.mockResolvedValue([]);
    repo.create.mockResolvedValue({ id: '1', numeroMandato: 1, status: 'ATIVO', usuarioId: 'u1' });
    const dto = { usuarioId: 'u1', dataInicio: '2026-01-01', dataFimPrevista: '2027-01-01', atoDesignacao: 'ATO-001' };
    const r = await service.create(dto as any);
    expect(r.id).toBe('1');
  });
  it('should reject if > 2 years', async () => {
    repo.findByUsuario.mockResolvedValue([]);
    const dto = { usuarioId: 'u1', dataInicio: '2026-01-01', dataFimPrevista: '2030-01-01', atoDesignacao: 'ATO-001' };
    await expect(service.create(dto as any)).rejects.toThrow('Mandato não pode exceder 2 anos');
  });
});
