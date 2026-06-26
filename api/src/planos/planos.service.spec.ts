import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PlanosService } from './planos.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  planoAuditoria: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  itemPlano: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  forcaTrabalho: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
});

describe('PlanosService', () => {
  let service: PlanosService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanosService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<PlanosService>(PlanosService);
    prisma = module.get(PrismaService) as any;
  });

  describe('create', () => {
    it('deve criar plano como RASCUNHO', async () => {
      prisma.planoAuditoria.create.mockResolvedValue({ id: 'plano-id', status: 'RASCUNHO' });
      const result = await service.create({ tipo: 'PAA', anoInicio: 2026, anoFim: 2026 }, 'user-id');
      expect(result.status).toBe('RASCUNHO');
    });
  });

  describe('workflow', () => {
    it('deve submeter plano RASCUNHO', async () => {
      prisma.planoAuditoria.findUnique.mockResolvedValue({
        id: 'p1',
        status: 'RASCUNHO',
        tipo: 'PAA',
        itensPlano: [{ id: 'i1', horasEstimadas: 100 }],
        forcTrabalho: [{ horasDisponiveisAno: 2000 }],
      });
      prisma.planoAuditoria.update.mockResolvedValue({ id: 'p1', status: 'SUBMETIDO' });
      const result = await service.submeter('p1');
      expect(result.status).toBe('SUBMETIDO');
    });

    it('deve rejeitar submeter plano sem itens', async () => {
      prisma.planoAuditoria.findUnique.mockResolvedValue({
        id: 'p1',
        status: 'RASCUNHO',
        tipo: 'PAA',
        itensPlano: [],
        forcTrabalho: [],
      });
      await expect(service.submeter('p1')).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar submeter com horas excedentes', async () => {
      prisma.planoAuditoria.findUnique.mockResolvedValue({
        id: 'p1',
        status: 'RASCUNHO',
        tipo: 'PAA',
        itensPlano: [{ horasEstimadas: 2500 }],
        forcTrabalho: [{ horasDisponiveisAno: 2000 }],
      });
      await expect(service.submeter('p1')).rejects.toThrow(BadRequestException);
    });

    it('deve aprovar plano SUBMETIDO', async () => {
      prisma.planoAuditoria.findUnique.mockResolvedValue({ id: 'p1', status: 'SUBMETIDO' });
      prisma.planoAuditoria.update.mockResolvedValue({ id: 'p1', status: 'APROVADO' });
      const result = await service.aprovar('p1');
      expect(result.status).toBe('APROVADO');
    });
  });
});
