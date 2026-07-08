import { Test, TestingModule } from '@nestjs/testing';
import { IntegracoesService } from './integracoes.service';
import { INTEGRACAO_REPOSITORY } from './repositories/integracao.repository';
import { LOG_INTEGRACAO_REPOSITORY } from './repositories/log-integracao.repository';

describe('IntegracoesService', () => {
  let service: IntegracoesService;
  let integracaoRepo: any;
  let logRepo: any;
  const mockIntegracaoRepo = () => ({
    findAll: jest.fn(),
    findUnique: jest.fn(),
    findByNome: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });
  const mockLogRepo = () => ({ create: jest.fn(), findByIntegracao: jest.fn() });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegracoesService,
        { provide: INTEGRACAO_REPOSITORY, useValue: mockIntegracaoRepo() },
        { provide: LOG_INTEGRACAO_REPOSITORY, useValue: mockLogRepo() },
      ],
    }).compile();
    service = module.get<IntegracoesService>(IntegracoesService);
    integracaoRepo = module.get(INTEGRACAO_REPOSITORY);
    logRepo = module.get(LOG_INTEGRACAO_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should findAll', async () => {
    integracaoRepo.findAll.mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });
  it('should findOne', async () => {
    integracaoRepo.findUnique.mockResolvedValue({ id: '1', nome: 'SIAUD' });
    expect((await service.findOne('1')).nome).toBe('SIAUD');
  });
  it('should throw if not found', async () => {
    integracaoRepo.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toThrow('Integração não encontrada');
  });
  it('should logs', async () => {
    integracaoRepo.findUnique.mockResolvedValue({ id: '1' });
    logRepo.findByIntegracao.mockResolvedValue([]);
    expect(await service.logs('1')).toEqual([]);
  });
});
