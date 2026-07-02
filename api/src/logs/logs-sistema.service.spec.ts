import { Test, TestingModule } from '@nestjs/testing';
import { LogsSistemaService } from './logs-sistema.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  logSistema: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
});

describe('LogsSistemaService', () => {
  let service: LogsSistemaService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsSistemaService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<LogsSistemaService>(LogsSistemaService);
    prisma = module.get(PrismaService) as any;
  });

  describe('findAll', () => {
    it('deve retornar logs paginados', async () => {
      const logs = [{ id: '1', acao: 'LOGIN_SUCESSO' }];
      prisma.logSistema.findMany.mockResolvedValue(logs);
      prisma.logSistema.count.mockResolvedValue(1);

      const result = await service.findAll({});
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });

    it('deve filtrar por ação', async () => {
      prisma.logSistema.findMany.mockResolvedValue([]);
      prisma.logSistema.count.mockResolvedValue(0);

      await service.findAll({ acao: 'LOGIN_SUCESSO' });
      expect(prisma.logSistema.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ acao: 'LOGIN_SUCESSO' }),
        }),
      );
    });

    it('deve filtrar por período', async () => {
      prisma.logSistema.findMany.mockResolvedValue([]);
      prisma.logSistema.count.mockResolvedValue(0);

      await service.findAll({ dataInicio: '2026-01-01', dataFim: '2026-12-31' });
      expect(prisma.logSistema.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: { gte: expect.any(Date), lte: expect.any(Date) },
          }),
        }),
      );
    });
  });

  describe('registrar', () => {
    it('deve criar entrada de log', async () => {
      const entrada = { id: '1', acao: 'LOGIN_SUCESSO', usuarioId: 'user-uuid' };
      prisma.logSistema.create.mockResolvedValue(entrada);

      const result = await service.registrar({ acao: 'LOGIN_SUCESSO', usuarioId: 'user-uuid' });
      expect(result).toHaveProperty('id');
      expect(prisma.logSistema.create).toHaveBeenCalledWith({
        data: { acao: 'LOGIN_SUCESSO', usuarioId: 'user-uuid' },
      });
    });
  });
});
