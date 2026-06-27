import { Test, TestingModule } from '@nestjs/testing';
import {
  RelatoriosController,
  RelatoriosAuditoriaController,
  RelatoriosAnuaisController,
} from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';
import { RelatorioPdfService } from './relatorio-pdf.service';

type MockService = {
  [K in keyof RelatoriosService]: jest.Mock;
};

describe('RelatoriosController', () => {
  let controller: RelatoriosController;
  let auditoriaController: RelatoriosAuditoriaController;
  let anuaisController: RelatoriosAnuaisController;
  let service: MockService;
  let pdfService: { gerarPdf: jest.Mock };

  beforeEach(async () => {
    const mockService: MockService = {
      gerar: jest.fn(),
      assinar: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      gerarAnual: jest.fn(),
    } as unknown as MockService;
    const mockPdfService = { gerarPdf: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelatoriosController, RelatoriosAuditoriaController, RelatoriosAnuaisController],
      providers: [
        { provide: RelatoriosService, useValue: mockService },
        { provide: RelatorioPdfService, useValue: mockPdfService },
      ],
    }).compile();

    controller = module.get<RelatoriosController>(RelatoriosController);
    auditoriaController = module.get<RelatoriosAuditoriaController>(RelatoriosAuditoriaController);
    anuaisController = module.get<RelatoriosAnuaisController>(RelatoriosAnuaisController);
    service = module.get(RelatoriosService) as unknown as MockService;
    pdfService = mockPdfService;
  });

  // ── POST /auditorias/:id/relatorios (RF-007.1/.2) ──

  describe('POST /auditorias/:id/relatorios', () => {
    it('deve delegar geração ao service com auditoriaId da rota', async () => {
      service.gerar.mockResolvedValue({ id: 'rel-1', tipo: 'PRELIMINAR' });

      const result = await auditoriaController.gerar('aud-1', {
        tipo: 'PRELIMINAR',
        autorId: 'user-p02',
      });

      expect(service.gerar).toHaveBeenCalledWith('aud-1', {
        tipo: 'PRELIMINAR',
        autorId: 'user-p02',
      });
      expect(result.id).toBe('rel-1');
    });
  });

  // ── GET /relatorios (RF-007.6: P05 vê só da unidade) ──

  describe('GET /relatorios', () => {
    it('deve repassar filtros da query', async () => {
      service.findAll.mockResolvedValue([{ id: 'rel-1' }]);
      await controller.findAll({ auditoriaId: 'aud-1', status: 'ASSINADO' });
      expect(service.findAll).toHaveBeenCalledWith({
        auditoriaId: 'aud-1',
        status: 'ASSINADO',
      });
    });
  });

  describe('GET /relatorios/:id', () => {
    it('deve delegar findOne', async () => {
      service.findOne.mockResolvedValue({ id: 'rel-1' });
      const result = await controller.findOne('rel-1');
      expect(service.findOne).toHaveBeenCalledWith('rel-1');
      expect(result.id).toBe('rel-1');
    });
  });

  // ── POST /relatorios/:id/assinar (RF-007.5) ──

  describe('POST /relatorios/:id/assinar', () => {
    it('deve delegar assinatura ao service', async () => {
      service.assinar.mockResolvedValue({ id: 'rel-1', status: 'ASSINADO' });

      const result = await controller.assinar('rel-1', { userId: 'user-p01' });

      expect(service.assinar).toHaveBeenCalledWith('rel-1', 'user-p01');
      expect(result.status).toBe('ASSINADO');
    });
  });

  // ── POST /relatorios-anuais (RF-007.4) ──

  describe('POST /relatorios-anuais', () => {
    it('deve delegar geração do relatório anual', async () => {
      service.gerarAnual.mockResolvedValue({ id: 'ra-1', ano: 2025 });

      const result = await anuaisController.gerar({ ano: 2025, autorId: 'user-p01' });

      expect(service.gerarAnual).toHaveBeenCalledWith(2025, 'user-p01');
      expect(result.ano).toBe(2025);
    });
  });

  // ── GET /relatorios/:id/pdf (T-085) ──

  describe('GET /relatorios/:id/pdf', () => {
    it('deve buscar o relatório e gerar o PDF', async () => {
      const relatorio = { id: 'rel-1', tipo: 'PRELIMINAR', conteudo: 'X' };
      const pdfBuffer = Buffer.from('%PDF-fake');
      service.findOne.mockResolvedValue(relatorio);
      pdfService.gerarPdf.mockResolvedValue(pdfBuffer);

      const result = await controller.pdf('rel-1');

      expect(service.findOne).toHaveBeenCalledWith('rel-1');
      expect(pdfService.gerarPdf).toHaveBeenCalledWith(relatorio);
      expect(result).toBe(pdfBuffer);
    });
  });
});
