import { Test, TestingModule } from '@nestjs/testing';
import {
  RecomendacoesController,
  RecomendacoesRelatorioController,
} from './recomendacoes.controller';
import { RecomendacoesService } from './recomendacoes.service';

type MockService = { [K in keyof RecomendacoesService]: jest.Mock };

describe('RecomendacoesController', () => {
  let controller: RecomendacoesController;
  let relatorioController: RecomendacoesRelatorioController;
  let service: MockService;

  beforeEach(async () => {
    const mockService = {
      criar: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      atualizar: jest.fn(),
      criarProvidencia: jest.fn(),
      validar: jest.fn(),
      verificarVencidas: jest.fn(),
      escalarVencidas: jest.fn(),
    } as unknown as MockService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecomendacoesController, RecomendacoesRelatorioController],
      providers: [{ provide: RecomendacoesService, useValue: mockService }],
    }).compile();

    controller = module.get<RecomendacoesController>(RecomendacoesController);
    relatorioController = module.get<RecomendacoesRelatorioController>(RecomendacoesRelatorioController);
    service = module.get(RecomendacoesService) as unknown as MockService;
  });

  // ── POST /relatorios/:id/recomendacoes (RF-008.1) ──

  describe('POST /relatorios/:id/recomendacoes', () => {
    it('deve delegar criação ao service', async () => {
      service.criar.mockResolvedValue({ id: 'rec-1', status: 'PENDENTE' });
      const body = { descricao: 'X', criticidade: 'ALTA', prazo: new Date(), responsavelId: 'u' };
      const result = await relatorioController.criar('rel-1', body);
      expect(service.criar).toHaveBeenCalledWith('rel-1', body);
      expect(result.id).toBe('rec-1');
    });
  });

  describe('GET /recomendacoes', () => {
    it('deve repassar filtros', async () => {
      service.findAll.mockResolvedValue([{ id: 'rec-1' }]);
      await controller.findAll({ status: 'VENCIDA' });
      expect(service.findAll).toHaveBeenCalledWith({ status: 'VENCIDA' });
    });
  });

  describe('GET /recomendacoes/:id', () => {
    it('deve delegar findOne', async () => {
      service.findOne.mockResolvedValue({ id: 'rec-1' });
      await controller.findOne('rec-1');
      expect(service.findOne).toHaveBeenCalledWith('rec-1');
    });
  });

  describe('PUT /recomendacoes/:id', () => {
    it('deve delegar atualização', async () => {
      service.atualizar.mockResolvedValue({ id: 'rec-1', status: 'CANCELADA' });
      await controller.atualizar('rec-1', { status: 'CANCELADA' });
      expect(service.atualizar).toHaveBeenCalledWith('rec-1', { status: 'CANCELADA' });
    });
  });

  // ── POST /recomendacoes/:id/providencias (RF-008.2) ──

  describe('POST /recomendacoes/:id/providencias', () => {
    it('deve delegar registro de providência', async () => {
      service.criarProvidencia.mockResolvedValue({ id: 'prov-1' });
      const body = { descricao: 'feito', autorId: 'user-p05' };
      await controller.criarProvidencia('rec-1', body);
      expect(service.criarProvidencia).toHaveBeenCalledWith('rec-1', body);
    });
  });

  // ── POST /recomendacoes/:id/validar (RF-008.3) ──

  describe('POST /recomendacoes/:id/validar', () => {
    it('deve delegar validação (P02)', async () => {
      service.validar.mockResolvedValue({ id: 'rec-1', status: 'CUMPRIDA' });
      const result = await controller.validar('rec-1');
      expect(service.validar).toHaveBeenCalledWith('rec-1');
      expect(result.status).toBe('CUMPRIDA');
    });
  });
});
