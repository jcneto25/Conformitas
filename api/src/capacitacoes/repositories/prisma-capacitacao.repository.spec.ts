import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaCapacitacaoRepository } from './prisma-capacitacao.repository';
import { ICapacitacaoRepository } from './capacitacao.repository';

describe('PrismaCapacitacaoRepository', () => {
  let repo: ICapacitacaoRepository;
  let prisma: any;

  const mockPrisma = () => ({
    capacitacao: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    configuracaoSistema: {
      findUnique: jest.fn(),
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaCapacitacaoRepository, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    repo = module.get<ICapacitacaoRepository>(PrismaCapacitacaoRepository);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('create', () => {
    it('should create a capacitacao', async () => {
      const data = {
        titulo: 'Curso',
        cargaHoraria: 20,
        tipo: 'CURSO',
        dataInicio: new Date('2026-03-01'),
        participanteIds: ['user-1'],
      };
      prisma.capacitacao.create.mockResolvedValue({ id: '1', ...data });
      const result = await repo.create(data);
      expect(prisma.capacitacao.create).toHaveBeenCalledWith({ data });
      expect(result.id).toBe('1');
    });
  });

  describe('findMany', () => {
    it('should filter by tipo', async () => {
      prisma.capacitacao.findMany.mockResolvedValue([]);
      await repo.findMany({ tipo: 'CURSO' });
      expect(prisma.capacitacao.findMany).toHaveBeenCalledWith({
        where: { tipo: 'CURSO' },
        orderBy: { dataInicio: 'desc' },
      });
    });

    it('should filter by participanteId', async () => {
      prisma.capacitacao.findMany.mockResolvedValue([]);
      await repo.findMany({ participanteId: 'user-1' });
      expect(prisma.capacitacao.findMany).toHaveBeenCalledWith({
        where: { participanteIds: { array_contains: 'user-1' } },
        orderBy: { dataInicio: 'desc' },
      });
    });

    it('should return all when no filters', async () => {
      prisma.capacitacao.findMany.mockResolvedValue([{ id: '1' }]);
      const result = await repo.findMany({});
      expect(result).toHaveLength(1);
    });

    it('should filter by ano', async () => {
      prisma.capacitacao.findMany.mockResolvedValue([{ id: '1', cargaHoraria: 20 }]);
      await repo.findMany({ participanteId: 'user-1', ano: 2026 });
      expect(prisma.capacitacao.findMany).toHaveBeenCalledWith({
        where: {
          participanteIds: { array_contains: 'user-1' },
          dataInicio: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
        orderBy: { dataInicio: 'desc' },
      });
    });
  });

  describe('findUnique', () => {
    it('should return by id', async () => {
      prisma.capacitacao.findUnique.mockResolvedValue({ id: '1', titulo: 'Curso' });
      const result = await repo.findUnique('1');
      expect(result.titulo).toBe('Curso');
    });

    it('should return null when not found', async () => {
      prisma.capacitacao.findUnique.mockResolvedValue(null);
      const result = await repo.findUnique('x');
      expect(result).toBeNull();
    });
  });

  describe('findConfig', () => {
    it('should return config value', async () => {
      prisma.configuracaoSistema.findUnique.mockResolvedValue({ valor: '40' });
      const result = await repo.findConfig('meta_horas_capacitacao_anual');
      expect(result.valor).toBe('40');
    });

    it('should return null when config not found', async () => {
      prisma.configuracaoSistema.findUnique.mockResolvedValue(null);
      const result = await repo.findConfig('non_existent');
      expect(result).toBeNull();
    });
  });
});
