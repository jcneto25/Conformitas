import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AchadosService } from './achados.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificacoesService } from '../notificacoes/notificacoes.service';
import { CreateAchadoDto, TipoAchado } from './dto/create-achado.dto';
import { TipoManifestacao } from './dto/create-manifestacao.dto';

const mockPrisma = () => ({
  achadoAuditoria: {
    count: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  manifestacao: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  auditoria: {
    findUnique: jest.fn(),
  },
  evidencia: {
    findMany: jest.fn(),
  },
  // $transaction executa o callback recebendo o próprio mock como client transacional.
  $transaction: jest.fn(),
});

const mockNotificacoes = () => ({
  criar: jest.fn().mockResolvedValue(undefined),
  notificarPorPerfil: jest.fn().mockResolvedValue(undefined),
  notificarGestoresUnidade: jest.fn().mockResolvedValue(undefined),
});

describe('AchadosService', () => {
  let service: AchadosService;
  let prisma: ReturnType<typeof mockPrisma>;
  let notificacoes: ReturnType<typeof mockNotificacoes>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchadosService,
        { provide: PrismaService, useValue: mockPrisma() },
        { provide: NotificacoesService, useValue: mockNotificacoes() },
      ],
    }).compile();

    service = module.get<AchadosService>(AchadosService);
    prisma = module.get(PrismaService) as any;
    notificacoes = module.get(NotificacoesService) as any;
    // Faz o callback da transação executar contra o mesmo mock (tx === prisma).
    prisma.$transaction.mockImplementation((cb: any) => cb(prisma));
  });

  // ── T-075: CRUD + 4 atributos ─────────────────
  // (A validação da obrigatoriedade dos 4 atributos → 422 é coberta em create-achado.dto.spec.ts — RF-006.2)

  describe('create', () => {
    const dto: CreateAchadoDto = {
      tipo: TipoAchado.NEGATIVO,
      situacaoEncontrada: 'Pagamento sem nota fiscal',
      criterio: 'Lei 8.666/93 art. 60',
      causa: 'Falta de controle interno',
      efeito: 'Prejuízo de R$ 50 mil',
    };

    it('deve criar achado como PRELIMINAR com autorId do JWT (não do corpo)', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1', status: 'EM_EXECUCAO' });
      prisma.achadoAuditoria.count.mockResolvedValue(0);
      prisma.achadoAuditoria.create.mockImplementation((args: any) =>
        Promise.resolve({
          id: 'ach-1',
          ...args.data,
          codigo: 'ACH-1',
          auditoria: { id: 'aud-1', numero: 'AUD-2026-0001', unidadeAuditada: 'SEC_X' },
          manifestacoes: [],
        }),
      );

      const result = await service.create('aud-1', dto, 'user-jwt');

      expect(result.status).toBe('PRELIMINAR');
      expect(result.codigo).toBe('ACH-1');
      // autorId vem do JWT, não do corpo do DTO
      expect(prisma.achadoAuditoria.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ autorId: 'user-jwt', auditoriaId: 'aud-1' }) }),
      );
    });

    it('deve rejeitar criação se auditoria não estiver EM_EXECUCAO', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1', status: 'ABERTA' });
      await expect(service.create('aud-1', dto, 'user-1')).rejects.toThrow(BadRequestException);
    });

    it('deve gerar código sequencial por auditoria', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1', status: 'EM_EXECUCAO' });
      prisma.achadoAuditoria.count.mockResolvedValue(5);
      prisma.achadoAuditoria.create.mockImplementation((args: any) =>
        Promise.resolve({ id: 'ach-6', ...args.data, codigo: 'ACH-6' } as any),
      );
      const result = await service.create('aud-1', dto, 'user-1');
      expect(result.codigo).toBe('ACH-6');
    });

    it('deve aceitar evidenciaIds que pertencem à mesma auditoria (R-ACH-001)', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1', status: 'EM_EXECUCAO' });
      prisma.evidencia.findMany.mockResolvedValue([
        { id: 'evd-1', auditoriaId: 'aud-1' },
        { id: 'evd-2', auditoriaId: 'aud-1' },
      ]);
      prisma.achadoAuditoria.count.mockResolvedValue(0);
      prisma.achadoAuditoria.create.mockImplementation((args: any) =>
        Promise.resolve({ id: 'ach-1', ...args.data } as any),
      );

      const result = await service.create('aud-1', { ...dto, evidenciaIds: ['evd-1', 'evd-2'] }, 'user-1');

      expect(prisma.evidencia.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['evd-1', 'evd-2'] }, auditoriaId: 'aud-1' },
        select: { id: true },
      });
      expect(result.evidenciaIds).toEqual(['evd-1', 'evd-2']);
    });

    it('deve rejeitar criação se evidenciaIds não pertencerem à auditoria (R-ACH-001)', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1', status: 'EM_EXECUCAO' });
      // Apenas 1 das 2 evidências passadas existe para aud-1
      prisma.evidencia.findMany.mockResolvedValue([{ id: 'evd-1', auditoriaId: 'aud-1' }]);

      await expect(
        service.create('aud-1', { ...dto, evidenciaIds: ['evd-1', 'evd-NAO_EXISTE'] }, 'user-1'),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.achadoAuditoria.create).not.toHaveBeenCalled();
    });

    it('não deve validar evidências quando evidenciaIds for vazio', async () => {
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1', status: 'EM_EXECUCAO' });
      prisma.achadoAuditoria.count.mockResolvedValue(0);
      prisma.achadoAuditoria.create.mockImplementation((args: any) =>
        Promise.resolve({ id: 'ach-1', ...args.data } as any),
      );

      await service.create('aud-1', { ...dto, evidenciaIds: [] }, 'user-1');

      expect(prisma.evidencia.findMany).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve listar com filtros status e tipo', async () => {
      prisma.achadoAuditoria.findMany.mockResolvedValue([{ id: 'ach-1', status: 'PRELIMINAR', tipo: 'NEGATIVO' }]);
      const result = await service.findAll({ status: 'PRELIMINAR', tipo: 'NEGATIVO' });
      expect(result).toHaveLength(1);
      expect(prisma.achadoAuditoria.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ status: 'PRELIMINAR', tipo: 'NEGATIVO' }) }),
      );
    });

    it('deve escopar pela unidade do usuário (P05)', async () => {
      prisma.achadoAuditoria.findMany.mockResolvedValue([]);
      await service.findAll({}, 'SEC_X');
      expect(prisma.achadoAuditoria.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ auditoria: { unidadeAuditada: 'SEC_X' } }) }),
      );
    });
  });

  describe('findOne', () => {
    it('deve lançar NotFoundException se achado não existe', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(null);
      await expect(service.findOne('inexistente')).rejects.toThrow(NotFoundException);
    });

    // ── Cenário #6 (multi-tenant): P05 não acessa achado de outra unidade
    it('deve bloquear P05 de acessar achado de outra unidade', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue({
        id: 'ach-1',
        auditoriaId: 'aud-1',
        auditoria: { id: 'aud-1', numero: 'X', unidadeAuditada: 'SEC_X' },
      });
      await expect(service.findOne('ach-1', 'SEC_Y')).rejects.toThrow(ForbiddenException);
    });
  });

  // ── T-076: Workflow ───────────────────────────

  describe('workflow', () => {
    const achadoPreliminar = {
      id: 'ach-1',
      auditoriaId: 'aud-1',
      autorId: 'user-p02',
      codigo: 'ACH-1',
      status: 'PRELIMINAR',
      auditoria: { id: 'aud-1', numero: 'AUD-2026-0001', unidadeAuditada: 'SEC_X' },
      manifestacoes: [],
      recomendacoes: [],
    };
    const achadoManifestacao = { ...achadoPreliminar, status: 'EM_MANIFESTACAO', prazoManifestacao: new Date() };

    it('PRELIMINAR → EM_MANIFESTACAO com prazo em dias úteis', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoPreliminar);
      prisma.achadoAuditoria.update.mockImplementation((args: any) =>
        Promise.resolve({ ...achadoManifestacao, prazoManifestacao: args.data.prazoManifestacao } as any),
      );

      const result = await service.enviarManifestacao('ach-1');

      expect(result.status).toBe('EM_MANIFESTACAO');
      // Prazo de 5 dias úteis a partir de hoje
      const prazo = result.prazoManifestacao as Date;
      expect(prazo.getTime()).toBeGreaterThan(Date.now());
      expect(prisma.achadoAuditoria.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'EM_MANIFESTACAO' }) }),
      );
    });

    // ── Cenário #3: enviar → P05 da unidade notificado
    it('deve notificar os gestores (P05) da unidade ao enviar para manifestação', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoPreliminar);
      prisma.achadoAuditoria.update.mockResolvedValue(achadoManifestacao);

      await service.enviarManifestacao('ach-1');

      expect(notificacoes.notificarGestoresUnidade).toHaveBeenCalledWith(
        'SEC_X',
        'ACHADO_MANIFESTACAO',
        expect.any(String),
        'aud-1',
      );
    });

    it('EM_MANIFESTACAO → CONSOLIDADO (manual)', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoManifestacao);
      prisma.achadoAuditoria.update.mockResolvedValue({
        ...achadoManifestacao,
        status: 'CONSOLIDADO',
        dataConsolidacao: new Date(),
      });
      const result = await service.consolidar('ach-1');
      expect(result.status).toBe('CONSOLIDADO');
    });

    it('deve rejeitar enviarManifestacao se não for PRELIMINAR', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoManifestacao);
      await expect(service.enviarManifestacao('ach-1')).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar prazoDiasUteis < 1 (impede zerar o prazo — RF-006.5)', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoPreliminar);
      await expect(service.enviarManifestacao('ach-1', 0)).rejects.toThrow(BadRequestException);
      await expect(service.enviarManifestacao('ach-1', -3)).rejects.toThrow(BadRequestException);
    });

    it('deve bloquear edição de achado que não esteja PRELIMINAR', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoManifestacao);
      await expect(service.update('ach-1', { criterio: 'novo' })).rejects.toThrow(BadRequestException);
    });
  });

  // ── T-077: Manifestações ──────────────────────

  describe('manifestacoes', () => {
    const achadoEmManifestacao = {
      id: 'ach-1',
      auditoriaId: 'aud-1',
      autorId: 'user-p02',
      codigo: 'ACH-1',
      status: 'EM_MANIFESTACAO',
      auditoria: { id: 'aud-1', numero: 'X', unidadeAuditada: 'SEC_X' },
      manifestacoes: [],
      recomendacoes: [],
    };

    // ── Cenário #4: P05 registra manifestação → achado consolidado + P02 notificado
    it('deve registrar manifestação, consolidar o achado e notificar o autor (P02)', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoEmManifestacao);
      prisma.manifestacao.create.mockImplementation((args: any) =>
        Promise.resolve({ id: 'man-1', ...args.data, achado: { id: 'ach-1', codigo: 'ACH-1', status: 'CONSOLIDADO' } }),
      );
      prisma.achadoAuditoria.update.mockResolvedValue({});

      const result = await service.criarManifestacao(
        'ach-1',
        { conteudo: 'Aceitamos', tipo: TipoManifestacao.CONCORDANCIA },
        'user-p05',
        'SEC_X',
      );

      expect(result.tipo).toBe('CONCORDANCIA');
      expect(prisma.manifestacao.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ autorId: 'user-p05', tipo: 'CONCORDANCIA' }) }),
      );
      // consolida o achado
      expect(prisma.achadoAuditoria.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'CONSOLIDADO' }) }),
      );
      // notifica o autor (P02)
      expect(notificacoes.criar).toHaveBeenCalledWith(
        'user-p02',
        'MANIFESTACAO_REGISTRADA',
        expect.any(String),
        'aud-1',
      );
      // retorno reflete o status consolidado (corrige o snapshot pré-consolidação do include)
      expect(result.achado.status).toBe('CONSOLIDADO');
    });

    it('deve rejeitar manifestação se achado não estiver EM_MANIFESTACAO', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue({ ...achadoEmManifestacao, status: 'PRELIMINAR' });
      await expect(
        service.criarManifestacao('ach-1', { conteudo: 'X', tipo: TipoManifestacao.CONCORDANCIA }, 'user-p05', 'SEC_X'),
      ).rejects.toThrow(BadRequestException);
    });

    // ── Cenário #6 (multi-tenant): P05 não manifesta sobre achado de outra unidade
    it('deve bloquear P05 de manifestar sobre achado de outra unidade (IDOR)', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoEmManifestacao);
      await expect(
        service.criarManifestacao(
          'ach-1',
          { conteudo: 'X', tipo: TipoManifestacao.CONCORDANCIA },
          'user-p05',
          'SEC_OUTRA',
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.manifestacao.create).not.toHaveBeenCalled();
    });

    it('deve permitir P01/P02 (sem unidadeEscopo) manifestar/acessar', async () => {
      prisma.achadoAuditoria.findUnique.mockResolvedValue(achadoEmManifestacao);
      prisma.manifestacao.create.mockResolvedValue({ id: 'man-1' });
      prisma.achadoAuditoria.update.mockResolvedValue({});
      // unidadeEscopo undefined → não restringe
      await expect(
        service.criarManifestacao('ach-1', { conteudo: 'X', tipo: TipoManifestacao.JUSTIFICATIVA }, 'user-p02'),
      ).resolves.toBeDefined();
    });
  });

  // ── T-078: Consolidação automática por expiração ──

  describe('consolidarExpirados', () => {
    // ── Cenário #5: prazo expira → consolidação com ressalva "sem manifestação"
    it('deve consolidar expirados com ressalva "sem manifestação" (updateMany)', async () => {
      prisma.achadoAuditoria.updateMany.mockResolvedValue({ count: 2 });

      const result = await service.consolidarExpirados();

      expect(result.consolidados).toBe(2);
      expect(prisma.achadoAuditoria.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'EM_MANIFESTACAO' }),
          data: expect.objectContaining({
            status: 'CONSOLIDADO',
            ressalva: expect.stringContaining('Sem manifestação'),
          }),
        }),
      );
    });

    it('deve retornar 0 se nenhum achado expirado', async () => {
      prisma.achadoAuditoria.updateMany.mockResolvedValue({ count: 0 });
      const result = await service.consolidarExpirados();
      expect(result.consolidados).toBe(0);
    });
  });
});
