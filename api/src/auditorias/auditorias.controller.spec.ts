import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriasController } from './auditorias.controller';
import { AuditoriasService } from './auditorias.service';

type MockAuditoriasService = {
  [K in keyof AuditoriasService]: jest.Mock;
};

describe('AuditoriasController', () => {
  let controller: AuditoriasController;
  let service: MockAuditoriasService;

  beforeEach(async () => {
    const mockService: MockAuditoriasService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      iniciarExecucao: jest.fn(),
      concluir: jest.fn(),
      suspender: jest.fn(),
      gerarComunicado: jest.fn(),
      criarEvidencia: jest.fn(),
      listarEvidencias: jest.fn(),
      criarPapelTrabalho: jest.fn(),
      listarPapeisTrabalho: jest.fn(),
      criarRequisicao: jest.fn(),
      listarRequisicoes: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditoriasController],
      providers: [{ provide: AuditoriasService, useValue: mockService }],
    }).compile();

    controller = module.get<AuditoriasController>(AuditoriasController);
    service = module.get(AuditoriasService) as MockAuditoriasService;
  });

  describe('POST /auditorias', () => {
    it('deve abrir auditoria a partir de item do PAA', async () => {
      service.create.mockResolvedValue({
        id: 'aud-1', codigo: 'AUD-2026-0001', status: 'ABERTA',
        itemPlanoId: 'item-1', sigilosa: false,
      });

      const result = await controller.create({
        itemPlanoId: 'item-1',
        observacoes: 'Teste',
        sigilosa: false,
      });

      expect(result).toHaveProperty('codigo', 'AUD-2026-0001');
      expect(service.create).toHaveBeenCalled();
    });

    it('deve abrir auditoria sigilosa', async () => {
      service.create.mockResolvedValue({
        id: 'aud-2', codigo: 'AUD-2026-0002', status: 'ABERTA',
        itemPlanoId: 'item-2', sigilosa: true,
      });

      const result = await controller.create({
        itemPlanoId: 'item-2',
        sigilosa: true,
      });

      expect(result).toHaveProperty('sigilosa', true);
    });
  });

  describe('GET /auditorias', () => {
    it('deve listar auditorias com filtro opcional', async () => {
      service.findAll.mockResolvedValue([{ id: '1', codigo: 'AUD-001', status: 'EM_EXECUCAO' }]);

      const result = await controller.findAll('EM_EXECUCAO', undefined, undefined, { user: { sub: 'user-uuid', email: 'test@test.com', roles: ['P01'] } } as any);
      expect(result).toHaveLength(1);
      expect(service.findAll).toHaveBeenCalledWith({
        status: 'EM_EXECUCAO', unidade: undefined, search: undefined,
      }, undefined);
    });
  });

  describe('GET /auditorias/:id', () => {
    it('deve retornar auditoria por ID', async () => {
      service.findOne.mockResolvedValue({ id: '1', codigo: 'AUD-001', status: 'ABERTA' });

      const result = await controller.findOne('1');
      expect(result).toHaveProperty('codigo');
    });
  });

  describe('POST /auditorias/:id/iniciar', () => {
    it('deve iniciar execução da auditoria', async () => {
      service.iniciarExecucao.mockResolvedValue({ id: '1', status: 'EM_EXECUCAO' });

      const result = await controller.iniciarExecucao('1');
      expect(result).toHaveProperty('status', 'EM_EXECUCAO');
    });
  });

  describe('POST /auditorias/:id/concluir', () => {
    it('deve concluir auditoria', async () => {
      service.concluir.mockResolvedValue({ id: '1', status: 'CONCLUIDA' });

      const result = await controller.concluir('1');
      expect(result).toHaveProperty('status', 'CONCLUIDA');
    });
  });

  describe('POST /auditorias/:id/suspender', () => {
    it('deve suspender auditoria com motivo', async () => {
      service.suspender.mockResolvedValue({
        id: '1', status: 'SUSPENSA', motivoSuspensao: 'Falta de pessoal',
      });

      const result = await controller.suspender('1', 'Falta de pessoal');
      expect(result).toHaveProperty('status', 'SUSPENSA');
    });
  });

  describe('POST /auditorias/:id/comunicado', () => {
    it('deve gerar comunicado de auditoria', async () => {
      const mockReq = { user: { sub: 'user-1', email: 'test@test.com', roles: ['P01'] } };
      service.gerarComunicado.mockResolvedValue({
        id: 'com-1', numero: 'COM-2026-0001', conteudo: '...',
      });

      const result = await controller.gerarComunicado(mockReq as any, 'aud-1');
      expect(result).toHaveProperty('numero');
      expect(service.gerarComunicado).toHaveBeenCalledWith('aud-1', 'user-1');
    });
  });

  describe('POST /auditorias/:id/evidencias', () => {
    it('deve adicionar evidência à auditoria', async () => {
      service.criarEvidencia.mockResolvedValue({
        id: 'ev-1', tipo: 'DOCUMENTO', descricao: 'Relatório X',
        arquivoPath: '/files/doc.pdf',
      });

      const result = await controller.criarEvidencia('aud-1', {
        tipo: 'DOCUMENTO', descricao: 'Relatório X', arquivoPath: '/files/doc.pdf',
      });

      expect(result).toHaveProperty('tipo', 'DOCUMENTO');
      expect(service.criarEvidencia).toHaveBeenCalled();
    });
  });

  describe('GET /auditorias/:id/evidencias', () => {
    it('deve listar evidências da auditoria', async () => {
      service.listarEvidencias.mockResolvedValue([{ id: 'ev-1', tipo: 'DOCUMENTO' }]);

      const result = await controller.listarEvidencias('aud-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('POST /auditorias/:id/papeis-trabalho', () => {
    it('deve criar papel de trabalho vinculado a evidências', async () => {
      const mockReq = { user: { sub: 'user-2', email: 'auditor@test.com', roles: ['P02'] } };
      service.criarPapelTrabalho.mockResolvedValue({
        id: 'pt-1', codigo: 'PT-001', descricao: 'Análise X',
        evidenciaIds: ['ev-1', 'ev-2'],
      });

      const result = await controller.criarPapelTrabalho(mockReq as any, 'aud-1', {
        codigo: 'PT-001', descricao: 'Análise X', evidenciaIds: ['ev-1', 'ev-2'],
      });

      expect(result).toHaveProperty('codigo', 'PT-001');
      expect(service.criarPapelTrabalho).toHaveBeenCalledWith(
        'aud-1', { codigo: 'PT-001', descricao: 'Análise X', evidenciaIds: ['ev-1', 'ev-2'] }, 'user-2',
      );
    });
  });

  describe('GET /auditorias/:id/papeis-trabalho', () => {
    it('deve listar papéis de trabalho', async () => {
      service.listarPapeisTrabalho.mockResolvedValue([{ id: 'pt-1', codigo: 'PT-001' }]);

      const result = await controller.listarPapeisTrabalho('aud-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('POST /auditorias/:id/requisicoes', () => {
    it('deve emitir requisição à unidade auditada', async () => {
      service.criarRequisicao.mockResolvedValue({
        id: 'req-1', descricao: 'Solicitação X', prazoDias: 5,
      });

      const result = await controller.criarRequisicao('aud-1', {
        descricao: 'Solicitação X', prazoDias: 5,
      });

      expect(result).toHaveProperty('prazoDias', 5);
    });
  });
});
