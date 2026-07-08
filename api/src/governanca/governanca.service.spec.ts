import { Test, TestingModule } from '@nestjs/testing';
import { GovernancaService } from './governanca.service';
import { DETERMINACAO_REPOSITORY } from './repositories/determinacao.repository';
import { REGISTRO_FRAUDE_REPOSITORY } from './repositories/registro-fraude.repository';

describe('GovernancaService', () => {
  let service: GovernancaService;
  let detRepo: any;
  let fraudeRepo: any;
  const mockDetRepo = () => ({ create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() });
  const mockFraudeRepo = () => ({ create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernancaService,
        { provide: DETERMINACAO_REPOSITORY, useValue: mockDetRepo() },
        { provide: REGISTRO_FRAUDE_REPOSITORY, useValue: mockFraudeRepo() },
      ],
    }).compile();
    service = module.get<GovernancaService>(GovernancaService);
    detRepo = module.get(DETERMINACAO_REPOSITORY);
    fraudeRepo = module.get(REGISTRO_FRAUDE_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('createDeterminacao', async () => {
    detRepo.create.mockResolvedValue({ id: '1' });
    expect((await service.createDeterminacao({})).id).toBe('1');
  });
  it('listarDeterminacoes', async () => {
    detRepo.findMany.mockResolvedValue([]);
    expect(await service.listarDeterminacoes()).toEqual([]);
  });
  it('buscarDeterminacao', async () => {
    detRepo.findUnique.mockResolvedValue({ id: '1' });
    expect((await service.buscarDeterminacao('1')).id).toBe('1');
  });
  it('throw if not found', async () => {
    detRepo.findUnique.mockResolvedValue(null);
    await expect(service.buscarDeterminacao('x')).rejects.toThrow('Determinação não encontrada');
  });
  it('createRegistroFraude', async () => {
    fraudeRepo.create.mockResolvedValue({ id: '1' });
    expect((await service.createRegistroFraude({})).id).toBe('1');
  });
  it('verificarFraudes60Dias', async () => {
    fraudeRepo.findMany.mockResolvedValue([]);
    expect((await service.verificarFraudes60Dias()).pendentes).toBe(0);
  });
});
