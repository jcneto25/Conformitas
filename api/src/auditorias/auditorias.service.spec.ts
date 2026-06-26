import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuditoriasService } from './auditorias.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  auditoria: {
    count: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  itemPlano: { findUnique: jest.fn() },
  comunicadoAuditoria: { count: jest.fn(), create: jest.fn() },
  evidencia: { create: jest.fn(), findMany: jest.fn() },
  papelTrabalho: { create: jest.fn(), findMany: jest.fn() },
  requisicao: { create: jest.fn(), findMany: jest.fn() },
});

describe('AuditoriasService', () => {
  let service: AuditoriasService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditoriasService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<AuditoriasService>(AuditoriasService);
    prisma = module.get(PrismaService) as any;
  });

  describe('create', () => {
    it('deve abrir auditoria a partir de item do PAA aprovado', async () => {
      prisma.itemPlano.findUnique.mockResolvedValue({
        id: 'item-1',
        objetivo: 'Auditar finanças',
        escopo: 'Secretaria de Finanças',
        universo: { unidadeResponsavel: 'SECRETARIA_X' },
        plano: { status: 'APROVADO' },
      });
      prisma.auditoria.count.mockResolvedValue(0);
      prisma.auditoria.create.mockResolvedValue({ id: 'aud-1', numero: 'AUD-2026-0001', status: 'ABERTA' });

      const result = await service.create({ itemPlanoId: 'item-1' });
      expect(result.status).toBe('ABERTA');
      expect(result).toHaveProperty('numero');
    });

    it('deve rejeitar abertura se plano não aprovado', async () => {
      prisma.itemPlano.findUnique.mockResolvedValue({
        id: 'item-1',
        universo: { unidadeResponsavel: 'X' },
        plano: { status: 'RASCUNHO' },
      });
      await expect(service.create({ itemPlanoId: 'item-1' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('workflow', () => {
    it('deve iniciar execução de auditoria ABERTA', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1', status: 'ABERTA' });
      prisma.auditoria.update.mockResolvedValue({ id: 'aud-1', status: 'EM_EXECUCAO' });
      const result = await service.iniciarExecucao('aud-1');
      expect(result.status).toBe('EM_EXECUCAO');
    });

    it('deve concluir auditoria EM_EXECUCAO', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1', status: 'EM_EXECUCAO' });
      prisma.auditoria.update.mockResolvedValue({ id: 'aud-1', status: 'CONCLUIDA' });
      const result = await service.concluir('aud-1');
      expect(result.status).toBe('CONCLUIDA');
    });

    it('deve suspender auditoria', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1', status: 'EM_EXECUCAO' });
      prisma.auditoria.update.mockResolvedValue({ id: 'aud-1', status: 'SUSPENSA' });
      const result = await service.suspender('aud-1', 'Obstrução de acesso');
      expect(result.status).toBe('SUSPENSA');
    });
  });

  describe('evidências', () => {
    it('deve criar evidência', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1' });
      prisma.evidencia.create.mockResolvedValue({ id: 'ev-1', tipo: 'DOCUMENTO' });
      const result = await service.criarEvidencia('aud-1', {
        tipo: 'DOCUMENTO',
        descricao: 'Relatório financeiro',
        arquivoPath: '/uploads/relatorio.pdf',
      });
      expect(result).toHaveProperty('id');
    });
  });

  describe('papéis de trabalho', () => {
    it('deve criar papel de trabalho', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1' });
      prisma.papelTrabalho.create.mockResolvedValue({ id: 'pt-1', codigo: 'PT-001' });
      const result = await service.criarPapelTrabalho(
        'aud-1',
        {
          codigo: 'PT-001',
          descricao: 'Teste de auditoria',
        },
        'autor-id',
      );
      expect(result.codigo).toBe('PT-001');
    });
  });
});
