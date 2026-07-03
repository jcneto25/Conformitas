import { Test, TestingModule } from '@nestjs/testing';
import { GovernancaController } from './governanca.controller';
import { GovernancaService } from './governanca.service';

const mockService = () => ({
  createDeterminacao: jest.fn(),
  listarDeterminacoes: jest.fn(),
  buscarDeterminacao: jest.fn(),
  atualizarDeterminacao: jest.fn(),
  concluirDeterminacao: jest.fn(),
  createRegistroFraude: jest.fn(),
  listarRegistrosFraude: jest.fn(),
  buscarRegistroFraude: jest.fn(),
  comunicar: jest.fn(),
});

describe('GovernancaController', () => {
  let controller: GovernancaController;
  let service: ReturnType<typeof mockService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GovernancaController],
      providers: [{ provide: GovernancaService, useValue: mockService() }],
    }).compile();

    controller = module.get<GovernancaController>(GovernancaController);
    service = module.get(GovernancaService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ── Determinações ─────────────────────────────

  describe('createDeterminacao', () => {
    it('deve delegar para service.createDeterminacao', async () => {
      const dto = { orgao: 'TCE' as any, numero: '123', descricao: 'Teste' };
      service.createDeterminacao.mockResolvedValue({ id: 'det-1' });
      const result = await controller.createDeterminacao(dto);
      expect(result).toEqual({ id: 'det-1' });
      expect(service.createDeterminacao).toHaveBeenCalledWith(dto);
    });
  });

  describe('listarDeterminacoes', () => {
    it('deve delegar para service.listarDeterminacoes', async () => {
      service.listarDeterminacoes.mockResolvedValue([]);
      await controller.listarDeterminacoes('TCE', 'PENDENTE');
      expect(service.listarDeterminacoes).toHaveBeenCalledWith({ orgao: 'TCE', status: 'PENDENTE' });
    });
  });

  describe('buscarDeterminacao', () => {
    it('deve delegar para service.buscarDeterminacao', async () => {
      service.buscarDeterminacao.mockResolvedValue({ id: 'det-1' });
      const result = await controller.buscarDeterminacao('det-1');
      expect(result).toEqual({ id: 'det-1' });
    });
  });

  describe('atualizarDeterminacao', () => {
    it('deve delegar para service.atualizarDeterminacao', async () => {
      const dto = { descricao: 'Nova' };
      service.atualizarDeterminacao.mockResolvedValue({ id: 'det-1', descricao: 'Nova' });
      const result = await controller.atualizarDeterminacao('det-1', dto);
      expect(result).toHaveProperty('descricao', 'Nova');
    });
  });

  describe('concluirDeterminacao', () => {
    it('deve delegar para service.concluirDeterminacao', async () => {
      service.concluirDeterminacao.mockResolvedValue({ id: 'det-1', status: 'CONCLUIDA' });
      const result = await controller.concluirDeterminacao('det-1');
      expect(result).toHaveProperty('status', 'CONCLUIDA');
    });
  });

  // ── Fraudes ────────────────────────────────────

  describe('createRegistroFraude', () => {
    it('deve delegar para service.createRegistroFraude', async () => {
      const dto = { descricao: 'Indício', classificacao: 'SUSPEITA' as any };
      service.createRegistroFraude.mockResolvedValue({ id: 'f-1' });
      const result = await controller.createRegistroFraude(dto);
      expect(result).toEqual({ id: 'f-1' });
    });
  });

  describe('listarRegistrosFraude', () => {
    it('deve delegar para service.listarRegistrosFraude', async () => {
      service.listarRegistrosFraude.mockResolvedValue([]);
      await controller.listarRegistrosFraude('SUSPEITA');
      expect(service.listarRegistrosFraude).toHaveBeenCalledWith({ classificacao: 'SUSPEITA' });
    });
  });

  describe('buscarRegistroFraude', () => {
    it('deve delegar para service.buscarRegistroFraude', async () => {
      service.buscarRegistroFraude.mockResolvedValue({ id: 'f-1' });
      const result = await controller.buscarRegistroFraude('f-1');
      expect(result).toEqual({ id: 'f-1' });
    });
  });

  describe('comunicar', () => {
    it('deve delegar para service.comunicar', async () => {
      const dto = { tipo: 'SUPERIOR' as any };
      service.comunicar.mockResolvedValue({ id: 'f-1', dataComunicacaoSuperior: new Date() });
      const result = await controller.comunicar('f-1', dto);
      expect(result).toHaveProperty('dataComunicacaoSuperior');
    });
  });
});
