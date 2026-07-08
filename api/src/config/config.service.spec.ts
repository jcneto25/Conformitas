import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';
import { CONFIGURACAO_REPOSITORY } from './repositories/configuracao.repository';

describe('ConfigService', () => {
  let service: ConfigService;
  let repo: any;
  const mockRepo = () => ({ findAll: jest.fn(), findUnique: jest.fn(), update: jest.fn() });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, { provide: CONFIGURACAO_REPOSITORY, useValue: mockRepo() }],
    }).compile();
    service = module.get<ConfigService>(ConfigService);
    repo = module.get(CONFIGURACAO_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should findAll', async () => {
    repo.findAll.mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });
  it('should findOne', async () => {
    repo.findUnique.mockResolvedValue({ chave: 'x', valor: '1' });
    expect((await service.findOne('x')).valor).toBe('1');
  });
  it('should throw if not found', async () => {
    repo.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toThrow('Configuração não encontrada');
  });
});
