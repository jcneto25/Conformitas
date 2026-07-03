import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuditoriasService } from './auditorias.service';
import { NotificacoesService } from '../notificacoes/notificacoes.service';
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
  usuarioPerfil: { findMany: jest.fn() },
  notificacao: { create: jest.fn() },
});

const mockNotificacoesService = () => ({
  criar: jest.fn(),
  listar: jest.fn(),
  listarNaoLidas: jest.fn(),
  marcarLida: jest.fn(),
  notificarPorPerfil: jest.fn(),
  notificarGestoresUnidade: jest.fn(),
});

describe('AuditoriasService', () => {
  let service: AuditoriasService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditoriasService,
        { provide: PrismaService, useValue: mockPrisma() },
        { provide: NotificacoesService, useValue: mockNotificacoesService() },
      ],
    }).compile();

    service = module.get<AuditoriasService>(AuditoriasService);
    prisma = module.get(PrismaService) as any;
  });

  describe('create', () => {
    beforeEach(() => {
      prisma.usuarioPerfil.findMany.mockResolvedValue([]);
    });

    it('deve abrir auditoria a partir de item do PAA aprovado', async () => {
      prisma.itemPlano.findUnique.mockResolvedValue({
        id: 'item-1',
        objetivo: 'Auditar finanças',
        escopo: 'Secretaria de Finanças',
        universo: { unidadeResponsavel: 'SECRETARIA_X' },
        plano: { status: 'APROVADO' },
      });
      prisma.auditoria.count.mockResolvedValue(0);
      prisma.auditoria.create.mockResolvedValue({ id: 'aud-1', numero: 'AUD-2026-0001', status: 'ABERTA', tipo: 'CONFORMIDADE', forma: 'DIRETA', unidadeAuditada: 'SECRETARIA_X', objetivo: 'Auditar finanças' });
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1', numero: 'AUD-2026-0001', unidadeAuditada: 'SECRETARIA_X', objetivo: 'Auditar finanças' });
      prisma.comunicadoAuditoria.count.mockResolvedValue(0);
      prisma.comunicadoAuditoria.create.mockResolvedValue({ id: 'com-1', numero: 'COM-AUD-2026-0001-1' });

      const result = await service.create({ itemPlanoId: 'item-1' }, 'user-1');
      expect(result.status).toBe('ABERTA');
      expect(result).toHaveProperty('numero');
      expect(prisma.comunicadoAuditoria.create).toHaveBeenCalled();
    });

    it('deve rejeitar abertura se plano não aprovado', async () => {
      prisma.itemPlano.findUnique.mockResolvedValue({
        id: 'item-1',
        objetivo: '',
        escopo: '',
        universo: { unidadeResponsavel: 'X' },
        plano: { status: 'RASCUNHO' },
      });
      await expect(service.create({ itemPlanoId: 'item-1' }, 'user-1')).rejects.toThrow(BadRequestException);
    });

    it('deve usar tipo e forma do DTO quando fornecidos', async () => {
      prisma.itemPlano.findUnique.mockResolvedValue({
        id: 'item-1',
        objetivo: 'Auditar',
        escopo: 'Escopo X',
        universo: { unidadeResponsavel: 'SECRETARIA_X' },
        plano: { status: 'APROVADO' },
      });
      prisma.auditoria.count.mockResolvedValue(1);
      prisma.auditoria.create.mockResolvedValue({ id: 'aud-2', numero: 'AUD-2026-0002', status: 'ABERTA', tipo: 'OPERACIONAL', forma: 'INTEGRADA', unidadeAuditada: 'SECRETARIA_X', objetivo: 'Auditar' });
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-2', numero: 'AUD-2026-0002', unidadeAuditada: 'SECRETARIA_X', objetivo: 'Auditar' });
      prisma.comunicadoAuditoria.count.mockResolvedValue(0);
      prisma.comunicadoAuditoria.create.mockResolvedValue({ id: 'com-2' });

      const result = await service.create({ itemPlanoId: 'item-1', tipo: 'OPERACIONAL', forma: 'INTEGRADA' }, 'user-1');
      expect(result.tipo).toBe('OPERACIONAL');
      expect(result.forma).toBe('INTEGRADA');
    });

    it('deve aceitar dataFimPrevista no create', async () => {
      prisma.itemPlano.findUnique.mockResolvedValue({
        id: 'item-1',
        objetivo: 'Auditar',
        escopo: 'Escopo X',
        universo: { unidadeResponsavel: 'SECRETARIA_X' },
        plano: { status: 'APROVADO' },
      });
      prisma.auditoria.count.mockResolvedValue(2);
      prisma.auditoria.create.mockResolvedValue({ id: 'aud-3', numero: 'AUD-2026-0003', status: 'ABERTA', dataFimPrevista: new Date('2026-12-31'), unidadeAuditada: 'SECRETARIA_X', objetivo: 'Auditar' });
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-3', numero: 'AUD-2026-0003', unidadeAuditada: 'SECRETARIA_X', objetivo: 'Auditar' });
      prisma.comunicadoAuditoria.count.mockResolvedValue(0);
      prisma.comunicadoAuditoria.create.mockResolvedValue({ id: 'com-3' });

      const result = await service.create({ itemPlanoId: 'item-1', dataFimPrevista: '2026-12-31' }, 'user-1');
      expect(result.dataFimPrevista).toBeDefined();
      expect(prisma.auditoria.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            dataFimPrevista: expect.any(Date),
          }),
        }),
      );
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

    it('deve suspender auditoria com motivo e notificar', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1', status: 'EM_EXECUCAO', numero: 'AUD-2026-0001' });
      prisma.auditoria.update.mockResolvedValue({ id: 'aud-1', status: 'SUSPENSA', motivoSuspensao: 'Obstrução de acesso' });
      prisma.usuarioPerfil.findMany.mockResolvedValue([]);
      const result = await service.suspender('aud-1', 'Obstrução de acesso');
      expect(result.status).toBe('SUSPENSA');
      expect(prisma.auditoria.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ motivoSuspensao: 'Obstrução de acesso' }) }),
      );
    });
  });

  describe('evidências', () => {
    it('deve criar evidência com arquivo', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1' });
      prisma.evidencia.create.mockResolvedValue({ id: 'ev-1', tipo: 'DOCUMENTO' });
      const result = await service.criarEvidencia(
        'aud-1',
        { tipo: 'DOCUMENTO', descricao: 'Relatório financeiro' },
        '/uploads/relatorio.pdf',
      );
      expect(result).toHaveProperty('id');
      expect(prisma.evidencia.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ arquivoPath: '/uploads/relatorio.pdf' }),
        }),
      );
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
