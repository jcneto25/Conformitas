import { Test, TestingModule } from '@nestjs/testing';
import { PlanosController } from './planos.controller';
import { PlanosService } from './planos.service';

type MockPlanosService = {
  [K in keyof PlanosService]: jest.Mock;
};

const mockReq = (roles: string[] = ['P01'], sub = 'user-1') => ({
  user: { sub, email: 'test@test.com', roles },
}) as any;

describe('PlanosController', () => {
  let controller: PlanosController;
  let service: MockPlanosService;

  beforeEach(async () => {
    const mockService: MockPlanosService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      submeter: jest.fn(),
      aprovar: jest.fn(),
      publicar: jest.fn(),
      criarRevisao: jest.fn(),
      adicionarItem: jest.fn(),
      listarItens: jest.fn(),
      removerItem: jest.fn(),
      adicionarForcaTrabalho: jest.fn(),
      listarForcaTrabalho: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanosController],
      providers: [{ provide: PlanosService, useValue: mockService }],
    }).compile();

    controller = module.get<PlanosController>(PlanosController);
    service = module.get(PlanosService) as MockPlanosService;
  });

  // ── Workflow ──────────────────────────────────

  describe('POST /planos/:id/submeter', () => {
    it('deve submeter plano de RASCUNHO para SUBMETIDO', async () => {
      service.submeter.mockResolvedValue({ id: 'p1', status: 'SUBMETIDO' });
      const result = await controller.submeter('p1');
      expect(result).toHaveProperty('status', 'SUBMETIDO');
    });
  });

  describe('POST /planos/:id/aprovar', () => {
    it('deve aprovar plano de SUBMETIDO para APROVADO', async () => {
      service.aprovar.mockResolvedValue({ id: 'p1', status: 'APROVADO' });
      const result = await controller.aprovar('p1');
      expect(result).toHaveProperty('status', 'APROVADO');
    });
  });

  describe('POST /planos/:id/publicar', () => {
    it('deve publicar plano de APROVADO para PUBLICADO', async () => {
      service.publicar.mockResolvedValue({ id: 'p1', status: 'PUBLICADO' });
      const result = await controller.publicar('p1');
      expect(result).toHaveProperty('status', 'PUBLICADO');
    });
  });

  describe('POST /planos/:id/revisao', () => {
    it('deve criar nova revisão de plano publicada', async () => {
      service.criarRevisao.mockResolvedValue({
        id: 'p2', tipo: 'PAA', versao: 2, status: 'RASCUNHO',
      });

      const result = await controller.criarRevisao(mockReq(), 'p1');
      expect(result).toHaveProperty('versao', 2);
      expect(result).toHaveProperty('status', 'RASCUNHO');
      expect(service.criarRevisao).toHaveBeenCalledWith('p1', 'user-1');
    });
  });

  // ── Força de Trabalho ─────────────────────────

  describe('POST /forca-trabalho', () => {
    it('deve adicionar força de trabalho', async () => {
      service.adicionarForcaTrabalho.mockResolvedValue({
        id: 'ft-1', planoId: 'p1', usuarioId: 'u1',
        horasDisponiveisAno: 2000, ano: 2026,
        usuario: { id: 'u1', nome: 'Auditor X', email: 'aud@test.com' },
      });

      const result = await controller.adicionarForcaTrabalho({
        planoId: 'p1', usuarioId: 'u1',
        horasDisponiveisAno: 2000, ano: 2026,
      });

      expect(result).toHaveProperty('horasDisponiveisAno', 2000);
      expect(result).toHaveProperty('usuario.nome');
      expect(service.adicionarForcaTrabalho).toHaveBeenCalledWith('p1', {
        usuarioId: 'u1', horasDisponiveisAno: 2000, ano: 2026,
      });
    });
  });

  describe('GET /forca-trabalho', () => {
    it('deve listar força de trabalho com filtro por plano', async () => {
      service.listarForcaTrabalho.mockResolvedValue([
        { id: 'ft-1', usuario: { nome: 'A1' }, horasDisponiveisAno: 2000 },
        { id: 'ft-2', usuario: { nome: 'A2' }, horasDisponiveisAno: 1600 },
      ]);

      const result = await controller.listarForcaTrabalho('p1', '2026');
      expect(result).toHaveLength(2);
      expect(service.listarForcaTrabalho).toHaveBeenCalledWith('p1', 2026);
    });

    it('deve listar força de trabalho sem filtros', async () => {
      service.listarForcaTrabalho.mockResolvedValue([]);

      const result = await controller.listarForcaTrabalho();
      expect(result).toHaveLength(0);
      expect(service.listarForcaTrabalho).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  // ── CRUD ──────────────────────────────────────

  describe('POST /planos', () => {
    it('deve criar plano PALP', async () => {
      service.create.mockResolvedValue({
        id: 'p1', tipo: 'PALP', anoInicio: 2025, anoFim: 2028, status: 'RASCUNHO', versao: 1,
      });

      const result = await controller.create(mockReq(), {
        tipo: 'PALP', anoInicio: 2025, anoFim: 2028,
      });

      expect(result).toHaveProperty('tipo', 'PALP');
      expect(service.create).toHaveBeenCalledWith(expect.any(Object), 'user-1');
    });
  });

  describe('GET /planos', () => {
    it('deve listar planos com filtros', async () => {
      service.findAll.mockResolvedValue([{ id: 'p1', tipo: 'PAA', status: 'APROVADO' }]);

      const result = await controller.findAll('PAA', '2026', 'APROVADO');
      expect(result).toHaveLength(1);
      expect(service.findAll).toHaveBeenCalledWith({ tipo: 'PAA', ano: 2026, status: 'APROVADO' });
    });
  });

  describe('GET /planos/:id', () => {
    it('deve retornar plano por ID', async () => {
      service.findOne.mockResolvedValue({ id: 'p1', tipo: 'PAA', status: 'RASCUNHO' });

      const result = await controller.findOne('p1');
      expect(result).toHaveProperty('id', 'p1');
    });
  });

  // ── Itens ─────────────────────────────────────

  describe('POST /planos/:id/itens', () => {
    it('deve adicionar item ao plano', async () => {
      service.adicionarItem.mockResolvedValue({
        id: 'item-1', planoId: 'p1', horasEstimadas: 200, tipoAuditoria: 'CONFORMIDADE',
      });

      const result = await controller.adicionarItem('p1', {
        universoAuditavelId: 'u1', tipoAuditoria: 'CONFORMIDADE',
        formaExecucao: 'PRESENCIAL', horasEstimadas: 200,
        escopo: 'Escopo X', objetivo: 'Objetivo Y', prioridade: 'ALTA',
      });

      expect(result).toHaveProperty('horasEstimadas', 200);
      expect(service.adicionarItem).toHaveBeenCalled();
    });
  });

  describe('GET /planos/:id/itens', () => {
    it('deve listar itens do plano', async () => {
      service.listarItens.mockResolvedValue([{ id: 'item-1' }]);
      const result = await controller.listarItens('p1');
      expect(result).toHaveLength(1);
    });
  });

  describe('DELETE /itens-plano/:id', () => {
    it('deve remover item do plano', async () => {
      service.removerItem.mockResolvedValue(undefined);
      const result = await controller.removerItem('item-1');
      expect(result).toBeUndefined();
    });
  });
});
