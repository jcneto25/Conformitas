import { Test, TestingModule } from '@nestjs/testing';
import { LogsSistemaService } from './logs-sistema.service';
import { LOG_SISTEMA_REPOSITORY } from './repositories/log-sistema.repository';

describe('LogsSistemaService', () => {
  let service: LogsSistemaService;
  let repo: any;
  const mockRepo = () => ({ findMany: jest.fn(), create: jest.fn() });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsSistemaService, { provide: LOG_SISTEMA_REPOSITORY, useValue: mockRepo() }],
    }).compile();
    service = module.get<LogsSistemaService>(LogsSistemaService);
    repo = module.get(LOG_SISTEMA_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findAll', async () => {
    repo.findMany.mockResolvedValue({ data: [], total: 0 });
    const r = await service.findAll({});
    expect(r.total).toBe(0);
  });
  it('registrar', async () => {
    repo.create.mockResolvedValue({ id: '1' });
    expect((await service.registrar({ acao: 'LOGIN' })).id).toBe('1');
  });
});
