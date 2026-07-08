import { Test, TestingModule } from '@nestjs/testing';
import { EticaService } from './etica.service';
import {
  DECLARACAO_REPOSITORY,
  IMPEDIMENTO_REPOSITORY,
  CLASSIFICACAO_REPOSITORY,
  LOG_SIGILOSO_REPOSITORY,
} from './repositories/declaracao.repository';

describe('EticaService', () => {
  let service: EticaService;
  let declRepo: any;
  let impRepo: any;
  let classRepo: any;
  let logRepo: any;
  const mockR = () => ({ create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() });
  const mockClass = () => ({ upsert: jest.fn(), findUnique: jest.fn() });
  const mockLog = () => ({ create: jest.fn(), findMany: jest.fn() });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EticaService,
        { provide: DECLARACAO_REPOSITORY, useValue: mockR() },
        { provide: IMPEDIMENTO_REPOSITORY, useValue: mockR() },
        { provide: CLASSIFICACAO_REPOSITORY, useValue: mockClass() },
        { provide: LOG_SIGILOSO_REPOSITORY, useValue: mockLog() },
      ],
    }).compile();
    service = module.get<EticaService>(EticaService);
    declRepo = module.get(DECLARACAO_REPOSITORY);
    impRepo = module.get(IMPEDIMENTO_REPOSITORY);
    classRepo = module.get(CLASSIFICACAO_REPOSITORY);
    logRepo = module.get(LOG_SIGILOSO_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('criarDeclaracao', async () => {
    declRepo.create.mockResolvedValue({ id: '1' });
    expect((await service.criarDeclaracao('u1', {})).id).toBe('1');
  });
  it('listarDeclaracoes', async () => {
    declRepo.findMany.mockResolvedValue([]);
    expect(await service.listarDeclaracoes()).toEqual([]);
  });
  it('classificarDocumento', async () => {
    classRepo.upsert.mockResolvedValue({ id: '1' });
    const r = await service.classificarDocumento('auditoria', 'aud-1', 'u1', { nivelSigilo: 'RESTRITO' });
    expect(r).toBeDefined();
  });
  it('verificarAcessoSigiloso permite público', async () => {
    classRepo.findUnique.mockResolvedValue(null);
    logRepo.create.mockResolvedValue({});
    const r = await service.verificarAcessoSigiloso('u1', 'auditoria', 'aud-1');
    expect(r.permitido).toBe(true);
  });
});
