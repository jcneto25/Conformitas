import { Test, TestingModule } from '@nestjs/testing';
import { QualidadeService } from './qualidade.service';
import { AVALIACAO_REPOSITORY } from './repositories/avaliacao.repository';
import { NAO_CONFORMIDADE_REPOSITORY } from './repositories/nao-conformidade.repository';
import { INDICADOR_REPOSITORY } from './repositories/indicador.repository';

describe('QualidadeService', () => {
  let service: QualidadeService;
  let repo: any;
  let ncRepo: any;
  let indRepo: any;
  const mockRepo = () => ({ create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QualidadeService,
        { provide: AVALIACAO_REPOSITORY, useValue: mockRepo() },
        { provide: NAO_CONFORMIDADE_REPOSITORY, useValue: mockRepo() },
        { provide: INDICADOR_REPOSITORY, useValue: mockRepo() },
      ],
    }).compile();
    service = module.get<QualidadeService>(QualidadeService);
    repo = module.get(AVALIACAO_REPOSITORY);
    ncRepo = module.get(NAO_CONFORMIDADE_REPOSITORY);
    indRepo = module.get(INDICADOR_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('createAvaliacao', async () => {
    repo.create.mockResolvedValue({ id: '1' });
    expect((await service.createAvaliacao({}, 'u1')).id).toBe('1');
  });
  it('listarAvaliacoes', async () => {
    repo.findMany.mockResolvedValue([]);
    expect(await service.listarAvaliacoes()).toEqual([]);
  });
  it('buscarAvaliacao', async () => {
    repo.findUnique.mockResolvedValue({ id: '1' });
    expect((await service.buscarAvaliacao('1')).id).toBe('1');
  });
  it('criarIndicador', async () => {
    indRepo.create.mockResolvedValue({ id: '1' });
    expect((await service.criarIndicador({})).id).toBe('1');
  });
});
