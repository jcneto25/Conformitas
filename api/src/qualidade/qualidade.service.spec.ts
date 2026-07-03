import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { QualidadeService } from './qualidade.service';
import { PrismaService } from '../prisma/prisma.service';
import { TipoAvaliacao } from './dto/create-avaliacao.dto';
import { Severidade } from './dto/create-nao-conformidade.dto';

const mockPrisma = () => ({
  avaliacaoQualidade: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  naoConformidade: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  indicadorQualidade: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
});

describe('QualidadeService', () => {
  let service: QualidadeService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QualidadeService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<QualidadeService>(QualidadeService);
    prisma = module.get(PrismaService) as any;
  });

  // ── Avaliações ────────────────────────────────

  describe('createAvaliacao', () => {
    it('deve criar avaliação com status RASCUNHO', async () => {
      prisma.avaliacaoQualidade.create.mockResolvedValue({
        id: 'av-1',
        tipo: 'AUTOAVALIACAO',
        periodoInicio: new Date('2025-01-01'),
        periodoFim: new Date('2025-12-31'),
        resultado: null,
        nota: 8.5,
        status: 'RASCUNHO',
      });

      const result = await service.createAvaliacao(
        {
          tipo: TipoAvaliacao.AUTOAVALIACAO,
          periodoInicio: '2025-01-01',
          periodoFim: '2025-12-31',
          nota: 8.5,
        },
        'user-1',
      );

      expect(result).toHaveProperty('status', 'RASCUNHO');
      expect(result).toHaveProperty('id', 'av-1');
    });

    it('deve aceitar avaliação do tipo EXTERNA', async () => {
      prisma.avaliacaoQualidade.create.mockResolvedValue({
        id: 'av-2',
        tipo: 'EXTERNA',
        status: 'RASCUNHO',
      });

      const result = await service.createAvaliacao(
        {
          tipo: TipoAvaliacao.EXTERNA,
          periodoInicio: '2025-01-01',
          periodoFim: '2025-12-31',
        },
        'user-2',
      );

      expect(result).toHaveProperty('tipo', 'EXTERNA');
    });
  });

  describe('listarAvaliacoes', () => {
    it('deve listar avaliações sem filtro', async () => {
      prisma.avaliacaoQualidade.findMany.mockResolvedValue([
        { id: '1', tipo: 'AUTOAVALIACAO', status: 'RASCUNHO', naoConformidades: [] },
      ]);

      const result = await service.listarAvaliacoes();
      expect(result).toHaveLength(1);
    });

    it('deve filtrar por tipo', async () => {
      prisma.avaliacaoQualidade.findMany.mockResolvedValue([
        { id: '1', tipo: 'EXTERNA', status: 'CONCLUIDA', naoConformidades: [] },
      ]);

      const result = await service.listarAvaliacoes({ tipo: 'EXTERNA' });
      expect(result).toHaveLength(1);
      expect(prisma.avaliacaoQualidade.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { tipo: 'EXTERNA' } }),
      );
    });
  });

  describe('buscarAvaliacao', () => {
    it('deve retornar avaliação por ID', async () => {
      prisma.avaliacaoQualidade.findUnique.mockResolvedValue({
        id: 'av-1',
        tipo: 'AUTOAVALIACAO',
        naoConformidades: [],
      });

      const result = await service.buscarAvaliacao('av-1');
      expect(result).toHaveProperty('id', 'av-1');
    });

    it('deve lançar NotFoundException se não existir', async () => {
      prisma.avaliacaoQualidade.findUnique.mockResolvedValue(null);
      await expect(service.buscarAvaliacao('inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('atualizarAvaliacao', () => {
    it('deve atualizar avaliação em RASCUNHO', async () => {
      prisma.avaliacaoQualidade.findUnique.mockResolvedValue({
        id: 'av-1',
        status: 'RASCUNHO',
      });
      prisma.avaliacaoQualidade.update.mockResolvedValue({
        id: 'av-1',
        nota: 9.0,
        status: 'RASCUNHO',
        naoConformidades: [],
      });

      const result = await service.atualizarAvaliacao('av-1', { nota: 9.0 });
      expect(result).toHaveProperty('nota', 9.0);
    });

    it('deve rejeitar atualização se não estiver RASCUNHO', async () => {
      prisma.avaliacaoQualidade.findUnique.mockResolvedValue({
        id: 'av-1',
        status: 'CONCLUIDA',
      });

      await expect(service.atualizarAvaliacao('av-1', { nota: 9.0 })).rejects.toThrow(BadRequestException);
    });
  });

  describe('concluirAvaliacao', () => {
    it('deve transitar RASCUNHO → CONCLUIDA', async () => {
      prisma.avaliacaoQualidade.findUnique.mockResolvedValue({
        id: 'av-1',
        status: 'RASCUNHO',
      });
      prisma.avaliacaoQualidade.update.mockResolvedValue({
        id: 'av-1',
        status: 'CONCLUIDA',
        naoConformidades: [],
      });

      const result = await service.concluirAvaliacao('av-1');
      expect(result).toHaveProperty('status', 'CONCLUIDA');
    });

    it('deve rejeitar se não estiver RASCUNHO', async () => {
      prisma.avaliacaoQualidade.findUnique.mockResolvedValue({
        id: 'av-1',
        status: 'HOMOLOGADA',
      });

      await expect(service.concluirAvaliacao('av-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('homologarAvaliacao', () => {
    it('deve transitar CONCLUIDA → HOMOLOGADA', async () => {
      prisma.avaliacaoQualidade.findUnique.mockResolvedValue({
        id: 'av-1',
        status: 'CONCLUIDA',
      });
      prisma.avaliacaoQualidade.update.mockResolvedValue({
        id: 'av-1',
        status: 'HOMOLOGADA',
        homologadaPor: 'user-1',
        naoConformidades: [],
      });

      const result = await service.homologarAvaliacao('av-1', 'user-1');
      expect(result).toHaveProperty('status', 'HOMOLOGADA');
    });

    it('deve rejeitar se não estiver CONCLUIDA', async () => {
      prisma.avaliacaoQualidade.findUnique.mockResolvedValue({
        id: 'av-1',
        status: 'RASCUNHO',
      });

      await expect(service.homologarAvaliacao('av-1', 'user-1')).rejects.toThrow(BadRequestException);
    });
  });

  // ── Não Conformidades ─────────────────────────

  describe('criarNaoConformidade', () => {
    it('deve criar NC vinculada a avaliação existente', async () => {
      prisma.avaliacaoQualidade.findUnique.mockResolvedValue({ id: 'av-1' });
      prisma.naoConformidade.create.mockResolvedValue({
        id: 'nc-1',
        avaliacaoId: 'av-1',
        descricao: 'Falha detectada',
        severidade: 'ALTA',
        status: 'ABERTA',
      });

      const result = await service.criarNaoConformidade('av-1', {
        descricao: 'Falha detectada',
        severidade: Severidade.ALTA,
      });

      expect(result).toHaveProperty('status', 'ABERTA');
      expect(result).toHaveProperty('avaliacaoId', 'av-1');
    });

    it('deve rejeitar se avaliação não existir', async () => {
      prisma.avaliacaoQualidade.findUnique.mockResolvedValue(null);

      await expect(
        service.criarNaoConformidade('inexistente', {
          descricao: 'Falha',
          severidade: Severidade.ALTA,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('listarNaoConformidades', () => {
    it('deve listar NCs sem filtro', async () => {
      prisma.naoConformidade.findMany.mockResolvedValue([{ id: 'nc-1', descricao: 'NC 1', status: 'ABERTA' }]);

      const result = await service.listarNaoConformidades();
      expect(result).toHaveLength(1);
    });

    it('deve filtrar NCs por avaliação', async () => {
      prisma.naoConformidade.findMany.mockResolvedValue([]);
      await service.listarNaoConformidades('av-1');
      expect(prisma.naoConformidade.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { avaliacaoId: 'av-1' } }),
      );
    });
  });

  describe('registrarAcaoCorretiva', () => {
    it('deve transitar ABERTA → EM_CORRECAO', async () => {
      prisma.naoConformidade.findUnique.mockResolvedValue({
        id: 'nc-1',
        status: 'ABERTA',
      });
      prisma.naoConformidade.update.mockResolvedValue({
        id: 'nc-1',
        status: 'EM_CORRECAO',
        acaoCorretiva: 'Implementar checklist',
      });

      const result = await service.registrarAcaoCorretiva('nc-1', {
        acaoCorretiva: 'Implementar checklist',
      });

      expect(result).toHaveProperty('status', 'EM_CORRECAO');
    });

    it('deve rejeitar se NC não estiver ABERTA', async () => {
      prisma.naoConformidade.findUnique.mockResolvedValue({
        id: 'nc-1',
        status: 'CORRIGIDA',
      });

      await expect(service.registrarAcaoCorretiva('nc-1', { acaoCorretiva: 'Ação' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('concluirNaoConformidade', () => {
    it('deve transitar EM_CORRECAO → CORRIGIDA', async () => {
      prisma.naoConformidade.findUnique.mockResolvedValue({
        id: 'nc-1',
        status: 'EM_CORRECAO',
      });
      prisma.naoConformidade.update.mockResolvedValue({
        id: 'nc-1',
        status: 'CORRIGIDA',
      });

      const result = await service.concluirNaoConformidade('nc-1');
      expect(result).toHaveProperty('status', 'CORRIGIDA');
    });

    it('deve rejeitar se NC não estiver EM_CORRECAO', async () => {
      prisma.naoConformidade.findUnique.mockResolvedValue({
        id: 'nc-1',
        status: 'ABERTA',
      });

      await expect(service.concluirNaoConformidade('nc-1')).rejects.toThrow(BadRequestException);
    });
  });

  // ── Indicadores ───────────────────────────────

  describe('criarIndicador', () => {
    it('deve criar indicador de qualidade', async () => {
      prisma.indicadorQualidade.create.mockResolvedValue({
        id: 'ind-1',
        nome: 'Taxa de Conformidade',
        periodicidade: 'TRIMESTRAL',
        meta: 90,
        valorAtual: null,
      });

      const result = await service.criarIndicador({
        nome: 'Taxa de Conformidade',
        periodicidade: 'TRIMESTRAL' as any,
        meta: 90,
      });

      expect(result).toHaveProperty('id', 'ind-1');
      expect(result).toHaveProperty('meta', 90);
    });
  });

  describe('listarIndicadores', () => {
    it('deve listar indicadores ordenados por nome', async () => {
      prisma.indicadorQualidade.findMany.mockResolvedValue([
        { id: 'ind-1', nome: 'A', periodicidade: 'ANUAL' },
        { id: 'ind-2', nome: 'B', periodicidade: 'MENSAL' },
      ]);

      const result = await service.listarIndicadores();
      expect(result).toHaveLength(2);
      expect(prisma.indicadorQualidade.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { nome: 'asc' } }),
      );
    });
  });

  describe('atualizarIndicador', () => {
    it('deve atualizar valorAtual do indicador', async () => {
      prisma.indicadorQualidade.findUnique.mockResolvedValue({ id: 'ind-1' });
      prisma.indicadorQualidade.update.mockResolvedValue({
        id: 'ind-1',
        valorAtual: 92.5,
      });

      const result = await service.atualizarIndicador('ind-1', { valorAtual: 92.5 });
      expect(result).toHaveProperty('valorAtual', 92.5);
    });

    it('deve lançar NotFoundException se indicador não existir', async () => {
      prisma.indicadorQualidade.findUnique.mockResolvedValue(null);
      await expect(service.atualizarIndicador('inexistente', { valorAtual: 50 })).rejects.toThrow(NotFoundException);
    });
  });
});
