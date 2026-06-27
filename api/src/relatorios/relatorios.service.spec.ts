import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  auditoria: {
    findUnique: jest.fn(),
    count: jest.fn(),
  },
  achadoAuditoria: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  relatorioAuditoria: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  relatorioAnual: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
});

const achadoPreliminar = (codigo = 'ACH-1') => ({
  id: `ach-${codigo}`,
  codigo,
  tipo: 'IRREGULARIDADE',
  situacaoEncontrada: 'Pagamento sem nota fiscal',
  criterio: 'Lei 8.666/93',
  causa: 'Controle interno fraco',
  efeito: 'Prejuízo de R$ 50 mil',
  status: 'PRELIMINAR',
  manifestacoes: [],
});

const achadoConsolidadoComManifestacao = () => ({
  ...achadoPreliminar('ACH-1'),
  status: 'CONSOLIDADO',
  manifestacoes: [{ id: 'man-1', conteudo: 'Concordamos', tipo: 'CONCORDANCIA' }],
});

const achadoConsolidadoSemManifestacao = () => ({
  ...achadoPreliminar('ACH-2'),
  status: 'CONSOLIDADO',
  manifestacoes: [], // prazo expirado, sem manifestação da unidade
});

describe('RelatoriosService', () => {
  let service: RelatoriosService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelatoriosService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<RelatoriosService>(RelatoriosService);
    prisma = module.get(PrismaService) as any;
  });

  // ── RF-007.1: Relatório Preliminar ─────────────

  describe('gerar — Preliminar (RF-007.1)', () => {
    it('deve compilar achados PRELIMINAR e gerar relatório estruturado', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({
        id: 'aud-1',
        numero: 'AUD-2026-0001',
        status: 'EM_EXECUCAO',
      });
      prisma.achadoAuditoria.findMany.mockResolvedValue([achadoPreliminar('ACH-1')]);
      prisma.relatorioAuditoria.create.mockImplementation(({ data }: any) => Promise.resolve({ id: 'rel-1', ...data }));

      const result = await service.gerar('aud-1', {
        tipo: 'PRELIMINAR',
        autorId: 'user-p02',
      });

      expect(result.tipo).toBe('PRELIMINAR');
      expect(result.status).toBe('PRELIMINAR');
      expect(result.auditoriaId).toBe('aud-1');
      expect(result.conteudo).toContain('RELATÓRIO PRELIMINAR');
      expect(result.conteudo).toContain('ACH-1');
      expect(result.dataEmissao).toBeDefined();
    });

    it('deve rejeitar se auditoria não existir', async () => {
      prisma.auditoria.findUnique.mockResolvedValue(null);

      await expect(service.gerar('inexistente', { tipo: 'PRELIMINAR', autorId: 'u' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve rejeitar Preliminar sem achados PRELIMINAR', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1' });
      prisma.achadoAuditoria.findMany.mockResolvedValue([]);

      await expect(service.gerar('aud-1', { tipo: 'PRELIMINAR', autorId: 'u' })).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar tipo inválido', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1' });

      await expect(service.gerar('aud-1', { tipo: 'XPTO' as any, autorId: 'u' })).rejects.toThrow(BadRequestException);
    });
  });

  // ── RF-007.2: Relatório Final ──────────────────

  describe('gerar — Final (RF-007.2)', () => {
    it('deve gerar Final quando todos os achados estão CONSOLIDADO (status RASCUNHO)', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({
        id: 'aud-1',
        numero: 'AUD-2026-0001',
      });
      prisma.achadoAuditoria.findMany.mockResolvedValue([
        achadoConsolidadoComManifestacao(),
        achadoConsolidadoSemManifestacao(),
      ]);
      prisma.relatorioAuditoria.create.mockImplementation(({ data }: any) => Promise.resolve({ id: 'rel-2', ...data }));

      const result = await service.gerar('aud-1', {
        tipo: 'FINAL',
        autorId: 'user-p02',
      });

      expect(result.tipo).toBe('FINAL');
      expect(result.status).toBe('RASCUNHO'); // aguarda assinatura P01
      expect(result.conteudo).toContain('RELATÓRIO FINAL');
    });

    it('deve rejeitar Final se algum achado não estiver CONSOLIDADO', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1' });
      prisma.achadoAuditoria.findMany.mockResolvedValue([
        achadoConsolidadoComManifestacao(),
        achadoPreliminar('ACH-3'), // ainda PRELIMINAR
      ]);

      await expect(service.gerar('aud-1', { tipo: 'FINAL', autorId: 'u' })).rejects.toThrow(BadRequestException);
    });
  });

  // ── RF-007.3: Ausência de manifestação ─────────

  describe('gerar — Final com ressalva (RF-007.3)', () => {
    it('deve incluir achados sem manifestação com ressalva no conteúdo', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1' });
      prisma.achadoAuditoria.findMany.mockResolvedValue([achadoConsolidadoSemManifestacao()]);
      prisma.relatorioAuditoria.create.mockImplementation(({ data }: any) => Promise.resolve({ id: 'rel-3', ...data }));

      const result = await service.gerar('aud-1', {
        tipo: 'FINAL',
        autorId: 'user-p02',
      });

      expect(result.conteudo).toContain('ressalva');
      expect(result.conteudo).toContain('ACH-2');
    });
  });

  // ── RF-007.5: Assinatura do Relatório Final ────

  describe('assinar (RF-007.5)', () => {
    it('deve assinar relatório RASCUNHO → ASSINADO', async () => {
      prisma.relatorioAuditoria.findUnique.mockResolvedValue({
        id: 'rel-1',
        tipo: 'FINAL',
        status: 'RASCUNHO',
      });
      prisma.relatorioAuditoria.update.mockImplementation(({ data }: any) =>
        Promise.resolve({ id: 'rel-1', status: 'ASSINADO', ...data }),
      );

      const result = await service.assinar('rel-1', 'user-p01');

      expect(result.status).toBe('ASSINADO');
      expect(result.assinadoPor).toBe('user-p01');
      expect(result.dataEmissao).toBeDefined();
    });

    it('deve rejeitar assinar relatório que não está RASCUNHO', async () => {
      prisma.relatorioAuditoria.findUnique.mockResolvedValue({
        id: 'rel-1',
        status: 'ASSINADO',
      });

      await expect(service.assinar('rel-1', 'user-p01')).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar assinar relatório inexistente', async () => {
      prisma.relatorioAuditoria.findUnique.mockResolvedValue(null);

      await expect(service.assinar('inexistente', 'user-p01')).rejects.toThrow(NotFoundException);
    });
  });

  // ── Consultas ──────────────────────────────────

  describe('findOne', () => {
    it('deve retornar relatório por id', async () => {
      prisma.relatorioAuditoria.findUnique.mockResolvedValue({
        id: 'rel-1',
        tipo: 'PRELIMINAR',
      });
      const result = await service.findOne('rel-1');
      expect(result.id).toBe('rel-1');
    });

    it('deve lançar NotFoundException se não existir', async () => {
      prisma.relatorioAuditoria.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('deve listar com filtro por auditoria/tipo/status', async () => {
      prisma.relatorioAuditoria.findMany.mockResolvedValue([{ id: 'rel-1', tipo: 'FINAL', status: 'ASSINADO' }]);
      const result = await service.findAll({
        auditoriaId: 'aud-1',
        tipo: 'FINAL',
        status: 'ASSINADO',
      });
      expect(result).toHaveLength(1);
      expect(prisma.relatorioAuditoria.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            auditoriaId: 'aud-1',
            tipo: 'FINAL',
            status: 'ASSINADO',
          }),
        }),
      );
    });
  });

  // ── RF-007.4: Relatório Anual ──────────────────

  describe('gerarAnual (RF-007.4)', () => {
    it('deve consolidar dados do exercício e gerar relatório anual (RASCUNHO)', async () => {
      prisma.relatorioAnual.findUnique.mockResolvedValue(null);
      prisma.auditoria.count.mockResolvedValue(12);
      prisma.achadoAuditoria.count.mockResolvedValue(34);
      prisma.relatorioAuditoria.count.mockResolvedValue(8);
      prisma.relatorioAnual.create.mockImplementation(({ data }: any) => Promise.resolve({ id: 'ra-1', ...data }));

      const result = await service.gerarAnual(2025, 'user-p01');

      expect(result.ano).toBe(2025);
      expect(result.status).toBe('RASCUNHO');
      expect(result.geradoPor).toBe('user-p01');
      expect(result.conteudo).toContain('2025');
      expect(result.conteudo).toContain('desempenho');
    });

    it('deve rejeitar se já existe relatório para o ano', async () => {
      prisma.relatorioAnual.findUnique.mockResolvedValue({
        id: 'ra-1',
        ano: 2025,
      });

      await expect(service.gerarAnual(2025, 'user-p01')).rejects.toThrow(ConflictException);
    });
  });
});
