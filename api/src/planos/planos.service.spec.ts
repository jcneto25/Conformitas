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

  describe('update', () => {
    it('deve atualizar plano em RASCUNHO', async () => {
      prisma.planoAuditoria.findUnique.mockResolvedValue({ id: 'p1', status: 'RASCUNHO', deletedAt: null });
      prisma.planoAuditoria.update.mockResolvedValue({ id: 'p1', tipo: 'PAA', status: 'RASCUNHO' });
      const result = await service.update('p1', { tipo: 'PAA' });
      expect(result.status).toBe('RASCUNHO');
    });

    it('deve rejeitar update de plano não-RASCUNHO', async () => {
      prisma.planoAuditoria.findUnique.mockResolvedValue({ id: 'p1', status: 'SUBMETIDO', deletedAt: null });
      await expect(service.update('p1', { tipo: 'PAA' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('devolver', () => {
    it('deve devolver plano SUBMETIDO para RASCUNHO', async () => {
      prisma.planoAuditoria.findUnique.mockResolvedValue({ id: 'p1', status: 'SUBMETIDO' });
      prisma.planoAuditoria.update.mockResolvedValue({ id: 'p1', status: 'RASCUNHO' });
      const result = await service.devolver('p1', 'Ajustar escopo');
      expect(result.status).toBe('RASCUNHO');
    });

    it('deve rejeitar devolução sem motivo', async () => {
      prisma.planoAuditoria.findUnique.mockResolvedValue({ id: 'p1', status: 'SUBMETIDO' });
      await expect(service.devolver('p1', '')).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar devolução de plano não-SUBMETIDO', async () => {
      prisma.planoAuditoria.findUnique.mockResolvedValue({ id: 'p1', status: 'RASCUNHO' });
      await expect(service.devolver('p1', 'Motivo')).rejects.toThrow(BadRequestException);
    });
  });

  describe('criarRevisao', () => {
    it('deve copiar itens da versão anterior', async () => {
      prisma.planoAuditoria.findUnique
        .mockResolvedValueOnce({
          id: 'p1',
          tipo: 'PAA',
          versao: 1,
          status: 'PUBLICADO',
          deletedAt: null,
          anoInicio: 2026,
          anoFim: 2026,
          criadoPorId: 'u1',
          itensPlano: [{ id: 'i1', universoAuditavelId: 'u1', tipoAuditoria: 'CONFORMIDADE' }],
          forcTrabalho: [],
        })
        .mockResolvedValueOnce({
          id: 'p2',
          tipo: 'PAA',
          versao: 2,
          status: 'RASCUNHO',
          itensPlano: [{ id: 'i2', universoAuditavelId: 'u1', tipoAuditoria: 'CONFORMIDADE' }],
          forcTrabalho: [],
        });
      prisma.planoAuditoria.create.mockResolvedValue({ id: 'p2', versao: 2 });
      prisma.itemPlano.create.mockResolvedValue({ id: 'i2' });

      const result = await service.criarRevisao('p1', 'u2');
      expect(result.versao).toBe(2);
      expect(prisma.itemPlano.create).toHaveBeenCalledTimes(1);
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
