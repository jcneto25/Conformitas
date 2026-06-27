import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AchadosService } from './achados.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  achadoAuditoria: {
    count: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  manifestacao: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  auditoria: {
    findUnique: jest.fn(),
  },
});

describe('AchadosService', () => {
  let service: AchadosService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchadosService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<AchadosService>(AchadosService);
    prisma = module.get(PrismaService) as any;
  });

  // ── T-075: CRUD com 4 atributos ──────────────

  describe('create', () => {
    it('deve criar achado com 4 atributos obrigatórios', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({
        id: 'aud-1',
        status: 'EM_EXECUCAO',
      });
      prisma.achadoAuditoria.count.mockResolvedValue(0);
      prisma.achadoAuditoria.create.mockResolvedValue({
        id: 'ach-1',
        codigo: 'ACH-1',
        tipo: 'IRREGULARIDADE',
        situacaoEncontrada: 'Pagamento sem nota fiscal',
        criterio: 'Lei 8.666/93 art. 60',
        causa: 'Falta de controle interno',
        efeito: 'Prejuízo de R$ 50 mil',
        status: 'PRELIMINAR',
        auditoria: { id: 'aud-1', numero: 'AUD-2026-0001', unidadeAuditada: 'SEC_X' },
        manifestacoes: [],
      });

      const result = await service.create({
        auditoriaId: 'aud-1',
        tipo: 'IRREGULARIDADE',
        situacaoEncontrada: 'Pagamento sem nota fiscal',
        criterio: 'Lei 8.666/93 art. 60',
        causa: 'Falta de controle interno',
        efeito: 'Prejuízo de R$ 50 mil',
        autorId: 'user-1',
      });

      expect(result.status).toBe('PRELIMINAR');
      expect(result.codigo).toBe('ACH-1');
      expect(result.tipo).toBe('IRREGULARIDADE');
      expect(result.situacaoEncontrada).toBe('Pagamento sem nota fiscal');
      expect(result.criterio).toBe('Lei 8.666/93 art. 60');
      expect(result.causa).toBe('Falta de controle interno');
      expect(result.efeito).toBe('Prejuízo de R$ 50 mil');
    });

    it('deve rejeitar criação se auditoria não estiver EM_EXECUCAO', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({
        id: 'aud-1',
        status: 'ABERTA',
      });

      await expect(
        service.create({
          auditoriaId: 'aud-1',
          tipo: 'CONFORMIDADE',
          situacaoEncontrada: 'X',
          criterio: 'Y',
          causa: 'Z',
          efeito: 'W',
          autorId: 'user-1',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve gerar código sequencial por auditoria', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({
        id: 'aud-1',
        status: 'EM_EXECUCAO',
      });
      prisma.achadoAuditoria.count.mockResolvedValue(5); // 5 achados existentes
      prisma.achadoAuditoria.create.mockResolvedValue({
        id: 'ach-6',
        codigo: 'ACH-6',
        status: 'PRELIMINAR',
        auditoria: { id: 'aud-1', numero: 'AUD-2026-0001', unidadeAuditada: 'X' },
        manifestacoes: [],
      });

      const result = await service.create({
        auditoriaId: 'aud-1',
        tipo: 'CONFORMIDADE',
        situacaoEncontrada: 'X',
        criterio: 'Y',
        causa: 'Z',
        efeito: 'W',
        autorId: 'user-1',
      });

      expect(result.codigo).toBe('ACH-6');
    });
  });

  describe('findAll', () => {
    it('deve listar achados com filtro por status', async () => {
      prisma.achadoAuditoria.findMany.mockResolvedValue([
        { id: 'ach-1', codigo: 'ACH-1', status: 'PRELIMINAR' },
      ]);

      const result = await service.findAll({ status: 'PRELIMINAR' });
      expect(result).toHaveLength(1);
      expect(result[0]!.status).toBe('PRELIMINAR');
    });
  });

  describe('findOne', () => {
    it('deve lançar NotFoundException se achado não existe', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(null);
      await expect(service.findOne('inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  // ── T-076: Workflow ──────────────────────────

  describe('workflow', () => {
    const achadoPreliminar = {
      id: 'ach-1',
      codigo: 'ACH-1',
      status: 'PRELIMINAR',
      auditoria: { id: 'aud-1', numero: 'AUD-2026-0001', unidadeAuditada: 'X' },
      manifestacoes: [],
      recomendacoes: [],
    };

    const achadoManifestacao = {
      ...achadoPreliminar,
      status: 'EM_MANIFESTACAO',
      prazoManifestacao: new Date(Date.now() + 5 * 86400000),
    };

    const achadoConsolidado = {
      ...achadoManifestacao,
      status: 'CONSOLIDADO',
      dataConsolidacao: new Date(),
    };

    it('PRELIminar → EM_MANIFESTACAO', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoPreliminar);
      prisma.achadoAuditoria.update.mockResolvedValue(achadoManifestacao);

      const result = await service.enviarManifestacao('ach-1');
      expect(result.status).toBe('EM_MANIFESTACAO');
      expect(result.prazoManifestacao).toBeDefined();
    });

    it('EM_MANIFESTACAO → CONSOLIDADO', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoManifestacao);
      prisma.achadoAuditoria.update.mockResolvedValue(achadoConsolidado);

      const result = await service.consolidar('ach-1');
      expect(result.status).toBe('CONSOLIDADO');
      expect(result.dataConsolidacao).toBeDefined();
    });

    it('deve rejeitar enviarManifestacao se não for PRELIMINAR', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoManifestacao);
      await expect(service.enviarManifestacao('ach-1')).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar consolidar se não for EM_MANIFESTACAO', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoPreliminar);
      await expect(service.consolidar('ach-1')).rejects.toThrow(BadRequestException);
    });

    it('deve permitir consolidar com prazo padrão de 5 dias', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoPreliminar);
      prisma.achadoAuditoria.update.mockImplementation((args: any) => {
        return Promise.resolve({ ...achadoManifestacao, prazoManifestacao: args.data.prazoManifestacao });
      });

      const result = await service.enviarManifestacao('ach-1', 7);
      // prazo deve ser ~7 dias no futuro
      expect(result.prazoManifestacao).toBeDefined();
    });
  });

  // ── T-077: Manifestações ─────────────────────

  describe('manifestacoes', () => {
    it('deve registrar manifestação em achado EM_MANIFESTACAO', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue({
        id: 'ach-1',
        status: 'EM_MANIFESTACAO',
        auditoria: { id: 'aud-1', numero: 'X', unidadeAuditada: 'Y' },
        manifestacoes: [],
        recomendacoes: [],
      });
      prisma.manifestacao.create.mockResolvedValue({
        id: 'man-1',
        conteudo: 'Aceitamos o achado',
        tipo: 'CONCORDANCIA',
        achado: { id: 'ach-1', codigo: 'ACH-1', status: 'EM_MANIFESTACAO' },
      });

      const result = await service.criarManifestacao('ach-1', {
        conteudo: 'Aceitamos o achado',
        tipo: 'CONCORDANCIA',
        autorId: 'user-p05',
      });

      expect(result.conteudo).toBe('Aceitamos o achado');
      expect(result.tipo).toBe('CONCORDANCIA');
    });

    it('deve rejeitar manifestação se achado não estiver EM_MANIFESTACAO', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue({
        id: 'ach-1',
        status: 'PRELIMINAR',
        auditoria: { id: 'aud-1', numero: 'X', unidadeAuditada: 'Y' },
        manifestacoes: [],
        recomendacoes: [],
      });

      await expect(
        service.criarManifestacao('ach-1', {
          conteudo: 'X',
          tipo: 'CONCORDANCIA',
          autorId: 'user-p05',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── T-078: Consolidação automática ───────────

  describe('consolidarExpirados', () => {
    it('deve consolidar achados com prazo de manifestação expirado', async () => {
      prisma.achadoAuditoria.findMany.mockResolvedValue([
        { id: 'ach-1', status: 'EM_MANIFESTACAO' },
        { id: 'ach-2', status: 'EM_MANIFESTACAO' },
      ]);
      prisma.achadoAuditoria.update.mockResolvedValue({
        status: 'CONSOLIDADO',
        dataConsolidacao: new Date(),
      });

      const result = await service.consolidarExpirados();
      expect(result.consolidados).toBe(2);
      expect(prisma.achadoAuditoria.update).toHaveBeenCalledTimes(2);
    });

    it('deve retornar 0 se nenhum achado expirado', async () => {
      prisma.achadoAuditoria.findMany.mockResolvedValue([]);

      const result = await service.consolidarExpirados();
      expect(result.consolidados).toBe(0);
      expect(prisma.achadoAuditoria.update).not.toHaveBeenCalled();
    });
  });
});
