import { Test, TestingModule } from '@nestjs/testing';
import { QualidadeController } from './qualidade.controller';
import { QualidadeService } from './qualidade.service';

const mockService = () => ({
  createAvaliacao: jest.fn(),
  listarAvaliacoes: jest.fn(),
  buscarAvaliacao: jest.fn(),
  atualizarAvaliacao: jest.fn(),
  concluirAvaliacao: jest.fn(),
  homologarAvaliacao: jest.fn(),
  criarNaoConformidade: jest.fn(),
  listarNaoConformidades: jest.fn(),
  registrarAcaoCorretiva: jest.fn(),
  concluirNaoConformidade: jest.fn(),
  criarIndicador: jest.fn(),
  listarIndicadores: jest.fn(),
  atualizarIndicador: jest.fn(),
});

const mockReq = (overrides = {}) =>
  ({
    user: { sub: 'user-1', email: 'auditor@tjce.jus.br', roles: ['P01'], ...overrides },
  }) as any;

describe('QualidadeController', () => {
  let controller: QualidadeController;
  let service: ReturnType<typeof mockService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QualidadeController],
      providers: [{ provide: QualidadeService, useValue: mockService() }],
    }).compile();

    controller = module.get<QualidadeController>(QualidadeController);
    service = module.get(QualidadeService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ── Avaliações ────────────────────────────────

  describe('createAvaliacao', () => {
    it('deve delegar para service.createAvaliacao', async () => {
      const dto = { tipo: 'AUTOAVALIACAO' as any, periodoInicio: '2025-01-01', periodoFim: '2025-12-31' };
      service.createAvaliacao.mockResolvedValue({ id: 'av-1' });

      const result = await controller.createAvaliacao(dto, mockReq());
      expect(result).toEqual({ id: 'av-1' });
      expect(service.createAvaliacao).toHaveBeenCalledWith(dto, 'user-1');
    });
  });

  describe('listarAvaliacoes', () => {
    it('deve delegar para service.listarAvaliacoes com filtros', async () => {
      service.listarAvaliacoes.mockResolvedValue([]);
      await controller.listarAvaliacoes('AUTOAVALIACAO', 'RASCUNHO');
      expect(service.listarAvaliacoes).toHaveBeenCalledWith({
        tipo: 'AUTOAVALIACAO',
        status: 'RASCUNHO',
      });
    });
  });

  describe('buscarAvaliacao', () => {
    it('deve delegar para service.buscarAvaliacao', async () => {
      service.buscarAvaliacao.mockResolvedValue({ id: 'av-1' });
      const result = await controller.buscarAvaliacao('av-1');
      expect(result).toEqual({ id: 'av-1' });
      expect(service.buscarAvaliacao).toHaveBeenCalledWith('av-1');
    });
  });

  describe('atualizarAvaliacao', () => {
    it('deve delegar para service.atualizarAvaliacao', async () => {
      const dto = { nota: 9.0 };
      service.atualizarAvaliacao.mockResolvedValue({ id: 'av-1', nota: 9.0 });
      const result = await controller.atualizarAvaliacao('av-1', dto);
      expect(result).toEqual({ id: 'av-1', nota: 9.0 });
    });
  });

  describe('concluirAvaliacao', () => {
    it('deve delegar para service.concluirAvaliacao', async () => {
      service.concluirAvaliacao.mockResolvedValue({ id: 'av-1', status: 'CONCLUIDA' });
      const result = await controller.concluirAvaliacao('av-1');
      expect(result).toHaveProperty('status', 'CONCLUIDA');
    });
  });

  describe('homologarAvaliacao', () => {
    it('deve delegar para service.homologarAvaliacao com user.sub', async () => {
      service.homologarAvaliacao.mockResolvedValue({ id: 'av-1', status: 'HOMOLOGADA' });
      const result = await controller.homologarAvaliacao('av-1', mockReq());
      expect(result).toHaveProperty('status', 'HOMOLOGADA');
      expect(service.homologarAvaliacao).toHaveBeenCalledWith('av-1', 'user-1');
    });
  });

  // ── Não Conformidades ─────────────────────────

  describe('criarNaoConformidade', () => {
    it('deve delegar para service.criarNaoConformidade', async () => {
      const dto = { descricao: 'Falha', severidade: 'ALTA' as any };
      service.criarNaoConformidade.mockResolvedValue({ id: 'nc-1', status: 'ABERTA' });
      const result = await controller.criarNaoConformidade('av-1', dto);
      expect(result).toHaveProperty('status', 'ABERTA');
      expect(service.criarNaoConformidade).toHaveBeenCalledWith('av-1', dto);
    });
  });

  describe('listarNaoConformidades', () => {
    it('deve delegar para service.listarNaoConformidades', async () => {
      service.listarNaoConformidades.mockResolvedValue([]);
      await controller.listarNaoConformidades('av-1');
      expect(service.listarNaoConformidades).toHaveBeenCalledWith('av-1');
    });

    it('deve listar sem filtro de avaliação', async () => {
      service.listarNaoConformidades.mockResolvedValue([]);
      await controller.listarNaoConformidades();
      expect(service.listarNaoConformidades).toHaveBeenCalledWith(undefined);
    });
  });

  describe('registrarAcaoCorretiva', () => {
    it('deve delegar para service.registrarAcaoCorretiva', async () => {
      const dto = { acaoCorretiva: 'Implementar checklist' };
      service.registrarAcaoCorretiva.mockResolvedValue({ id: 'nc-1', status: 'EM_CORRECAO' });
      const result = await controller.registrarAcaoCorretiva('nc-1', dto);
      expect(result).toHaveProperty('status', 'EM_CORRECAO');
    });
  });

  describe('concluirNaoConformidade', () => {
    it('deve delegar para service.concluirNaoConformidade', async () => {
      service.concluirNaoConformidade.mockResolvedValue({ id: 'nc-1', status: 'CORRIGIDA' });
      const result = await controller.concluirNaoConformidade('nc-1');
      expect(result).toHaveProperty('status', 'CORRIGIDA');
    });
  });

  // ── Indicadores ───────────────────────────────

  describe('criarIndicador', () => {
    it('deve delegar para service.criarIndicador', async () => {
      const dto = { nome: 'Taxa', periodicidade: 'TRIMESTRAL' as any };
      service.criarIndicador.mockResolvedValue({ id: 'ind-1' });
      const result = await controller.criarIndicador(dto);
      expect(result).toEqual({ id: 'ind-1' });
    });
  });

  describe('listarIndicadores', () => {
    it('deve delegar para service.listarIndicadores', async () => {
      service.listarIndicadores.mockResolvedValue([]);
      const result = await controller.listarIndicadores();
      expect(result).toEqual([]);
    });
  });

  describe('atualizarIndicador', () => {
    it('deve delegar para service.atualizarIndicador', async () => {
      const dto = { valorAtual: 92.5 };
      service.atualizarIndicador.mockResolvedValue({ id: 'ind-1', valorAtual: 92.5 });
      const result = await controller.atualizarIndicador('ind-1', dto);
      expect(result).toHaveProperty('valorAtual', 92.5);
    });
  });
});
