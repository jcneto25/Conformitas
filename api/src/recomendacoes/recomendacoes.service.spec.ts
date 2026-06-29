import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RecomendacoesService } from './recomendacoes.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  relatorioAuditoria: { findUnique: jest.fn() },
  recomendacao: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  providencia: { create: jest.fn(), findMany: jest.fn() },
});

describe('RecomendacoesService', () => {
  let service: RecomendacoesService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecomendacoesService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();
    service = module.get<RecomendacoesService>(RecomendacoesService);
    prisma = module.get(PrismaService) as any;
  });

  // ── RF-008.1: Emitir recomendação ──────────────

  describe('criar (RF-008.1)', () => {
    it('deve criar recomendação PENDENTE vinculada ao relatório', async () => {
      prisma.relatorioAuditoria.findUnique.mockResolvedValue({ id: 'rel-1', tipo: 'FINAL' });
      prisma.recomendacao.create.mockImplementation(({ data }: any) =>
        Promise.resolve({ id: 'rec-1', ...data }),
      );

      const result = await service.criar('rel-1', {
        descricao: 'Implementar controle X',
        criticidade: 'ALTA',
        prazo: new Date('2026-09-01'),
        responsavelId: 'user-p05',
        achadoId: 'ach-1',
      });

      expect(result.status).toBe('PENDENTE');
      expect(result.relatorioId).toBe('rel-1');
      expect(result.criticidade).toBe('ALTA');
    });

    it('deve rejeitar se relatório não existir', async () => {
      prisma.relatorioAuditoria.findUnique.mockResolvedValue(null);
      await expect(
        service.criar('inexistente', {
          descricao: 'X',
          criticidade: 'ALTA',
          prazo: new Date(),
          responsavelId: 'u',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve rejeitar criticidade inválida', async () => {
      prisma.relatorioAuditoria.findUnique.mockResolvedValue({ id: 'rel-1', tipo: 'FINAL' });
      await expect(
        service.criar('rel-1', {
          descricao: 'X',
          criticidade: 'GRAVE' as any,
          prazo: new Date(),
          responsavelId: 'u',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── Consultas ──────────────────────────────────

  describe('findAll', () => {
    it('deve listar com filtros status/criticidade/auditoriaId', async () => {
      prisma.recomendacao.findMany.mockResolvedValue([{ id: 'rec-1', status: 'PENDENTE' }]);
      const result = await service.findAll({ status: 'PENDENTE', criticidade: 'ALTA' });
      expect(result).toHaveLength(1);
      expect(prisma.recomendacao.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'PENDENTE', criticidade: 'ALTA' }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('deve lançar NotFoundException se não existir', async () => {
      prisma.recomendacao.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  // ── RF-008.2: Providência → EM_ANDAMENTO ───────

  describe('criarProvidencia (RF-008.2)', () => {
    it('deve registrar providência e mudar status para EM_ANDAMENTO', async () => {
      prisma.recomendacao.findUnique.mockResolvedValue({ id: 'rec-1', status: 'PENDENTE' });
      prisma.providencia.create.mockResolvedValue({ id: 'prov-1', descricao: 'Controle implementado' });

      const result = await service.criarProvidencia('rec-1', {
        descricao: 'Controle implementado em 15/03',
        autorId: 'user-p05',
        evidenciaPath: '/evidencias/1.pdf',
      });

      expect(result.descricao).toContain('Controle implementado');
      // status deve ir para EM_ANDAMENTO
      expect(prisma.recomendacao.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'rec-1' }, data: expect.objectContaining({ status: 'EM_ANDAMENTO' }) }),
      );
    });

    it('deve rejeitar providência em recomendação CUMPRIDA', async () => {
      prisma.recomendacao.findUnique.mockResolvedValue({ id: 'rec-1', status: 'CUMPRIDA' });
      await expect(
        service.criarProvidencia('rec-1', { descricao: 'X', autorId: 'u' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── RF-008.3: Validar → CUMPRIDA ───────────────

  describe('validar (RF-008.3)', () => {
    it('deve validar implementação e mudar status para CUMPRIDA', async () => {
      prisma.recomendacao.findUnique.mockResolvedValue({ id: 'rec-1', status: 'EM_ANDAMENTO' });
      prisma.recomendacao.update.mockImplementation(({ data }: any) =>
        Promise.resolve({ id: 'rec-1', ...data }),
      );

      const result = await service.validar('rec-1');
      expect(result.status).toBe('CUMPRIDA');
    });

    it('deve rejeitar validação se não estiver EM_ANDAMENTO', async () => {
      prisma.recomendacao.findUnique.mockResolvedValue({ id: 'rec-1', status: 'PENDENTE' });
      await expect(service.validar('rec-1')).rejects.toThrow(BadRequestException);
    });
  });

  // ── RF-008.4: Vencimento ───────────────────────

  describe('verificarVencidas (RF-008.4)', () => {
    it('deve marcar PENDENTE/EM_ANDAMENTO com prazo expirado como VENCIDA e notificar P01/P06', async () => {
      prisma.recomendacao.findMany.mockResolvedValue([
        { id: 'rec-1', status: 'PENDENTE', prazo: new Date('2026-01-01') },
        { id: 'rec-2', status: 'EM_ANDAMENTO', prazo: new Date('2026-01-01') },
      ]);
      prisma.recomendacao.update.mockResolvedValue({ status: 'VENCIDA' });

      const result = await service.verificarVencidas();

      expect(result.vencidas).toBe(2);
      expect(prisma.recomendacao.update).toHaveBeenCalledTimes(2);
      expect(result.notificados).toEqual(expect.arrayContaining(['P01', 'P06']));
    });

    it('deve retornar 0 se nenhuma vencida', async () => {
      prisma.recomendacao.findMany.mockResolvedValue([]);
      const result = await service.verificarVencidas();
      expect(result.vencidas).toBe(0);
      expect(prisma.recomendacao.update).not.toHaveBeenCalled();
    });
  });

  // ── RF-008.5: Escalonamento 30 dias ────────────

  describe('escalarVencidas (RF-008.5)', () => {
    it('deve escalar recomendações VENCIDA há mais de 30 dias (notificar P01)', async () => {
      const antiga = new Date();
      antiga.setDate(antiga.getDate() - 40); // prazo ~40 dias atrás
      prisma.recomendacao.findMany.mockResolvedValue([
        { id: 'rec-1', status: 'VENCIDA', prazo: antiga, responsavelId: 'u' },
      ]);

      const result = await service.escalarVencidas();

      expect(result.escaladas).toBe(1);
      expect(result.notificar).toEqual(expect.arrayContaining(['P01']));
    });

    it('deve aplicar limiar de 30 dias no filtro de escalonamento', async () => {
      prisma.recomendacao.findMany.mockResolvedValue([]);
      await service.escalarVencidas();

      expect(prisma.recomendacao.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'VENCIDA',
            prazo: expect.objectContaining({ lt: expect.any(Date) }),
          }),
        }),
      );
      // o lt deve ser ~30 dias atrás (regra de escalonamento RF-008.5)
      const call = prisma.recomendacao.findMany.mock.calls[0][0];
      const diasAtras = (Date.now() - call.where.prazo.lt.getTime()) / 86_400_000;
      expect(diasAtras).toBeGreaterThan(29);
      expect(diasAtras).toBeLessThan(31);
    });
  });
});
