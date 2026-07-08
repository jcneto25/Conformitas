import { Test, TestingModule } from '@nestjs/testing';
import { NotificacoesService } from './notificacoes.service';
import { NOTIFICACAO_REPOSITORY } from './repositories/notificacao.repository';

describe('NotificacoesService', () => {
  let service: NotificacoesService;
  let repo: any;
  const mockRepo = () => ({
    create: jest.fn(),
    createMany: jest.fn(),
    findMany: jest.fn(),
    updateMany: jest.fn(),
    findPerfisWithUsuario: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificacoesService, { provide: NOTIFICACAO_REPOSITORY, useValue: mockRepo() }],
    }).compile();
    service = module.get<NotificacoesService>(NotificacoesService);
    repo = module.get(NOTIFICACAO_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('criar creates notification', async () => {
    repo.create.mockResolvedValue({ id: '1' });
    expect((await service.criar('u1', 'TEST', 'msg')).id).toBe('1');
  });
  it('listar returns notifications', async () => {
    repo.findMany.mockResolvedValue([]);
    expect(await service.listar('u1')).toEqual([]);
  });
  it('notificarPorPerfil fan-out', async () => {
    repo.findPerfisWithUsuario.mockResolvedValue([{ usuario: { id: 'u1' } }, { usuario: { id: 'u2' } }]);
    await service.notificarPorPerfil('P02', 'TEST', 'msg');
    expect(repo.createMany).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ usuarioId: 'u1' })]),
    );
  });
});
