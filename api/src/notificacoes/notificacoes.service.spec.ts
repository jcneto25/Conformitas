import { Test, TestingModule } from '@nestjs/testing';
import { NotificacoesService } from './notificacoes.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  notificacao: {
    create: jest.fn(),
    findMany: jest.fn(),
    updateMany: jest.fn(),
  },
});

describe('NotificacoesService', () => {
  let service: NotificacoesService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificacoesService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<NotificacoesService>(NotificacoesService);
    prisma = module.get(PrismaService) as any;
  });

  describe('criar', () => {
    it('deve criar notificação', async () => {
      prisma.notificacao.create.mockResolvedValue({ id: 'not-1' });
      const result = await service.criar('user-1', 'TESTE', 'Mensagem de teste');
      expect(result).toHaveProperty('id');
    });

    it('deve criar notificação vinculada a auditoria', async () => {
      prisma.notificacao.create.mockResolvedValue({ id: 'not-2' });
      const result = await service.criar('user-1', 'AUDITORIA_ABERTA', 'Auditoria aberta', 'aud-1');
      expect(result).toHaveProperty('id');
      expect(prisma.notificacao.create).toHaveBeenCalledWith({
        data: { usuarioId: 'user-1', tipo: 'AUDITORIA_ABERTA', mensagem: 'Auditoria aberta', auditoriaId: 'aud-1' },
      });
    });
  });

  describe('listar', () => {
    it('deve listar notificações do usuário', async () => {
      prisma.notificacao.findMany.mockResolvedValue([{ id: 'not-1' }, { id: 'not-2' }]);
      const result = await service.listar('user-1');
      expect(result).toHaveLength(2);
      expect(prisma.notificacao.findMany).toHaveBeenCalledWith({
        where: { usuarioId: 'user-1' },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    });
  });

  describe('marcarLida', () => {
    it('deve marcar notificação como lida', async () => {
      prisma.notificacao.updateMany.mockResolvedValue({ count: 1 });
      await service.marcarLida('not-1', 'user-1');
      expect(prisma.notificacao.updateMany).toHaveBeenCalledWith({
        where: { id: 'not-1', usuarioId: 'user-1' },
        data: { lida: true },
      });
    });
  });

  describe('listarNaoLidas', () => {
    it('deve listar apenas notificações não lidas', async () => {
      prisma.notificacao.findMany.mockResolvedValue([{ id: 'not-1', lida: false }]);
      const result = await service.listarNaoLidas('user-1');
      expect(result).toHaveLength(1);
      expect(prisma.notificacao.findMany).toHaveBeenCalledWith({
        where: { usuarioId: 'user-1', lida: false },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
