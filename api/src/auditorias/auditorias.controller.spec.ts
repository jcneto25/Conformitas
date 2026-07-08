import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriasController } from './auditorias.controller';
import { AuditoriasService } from './auditorias.service';
import { AbrirAuditoriaUseCase } from './use-cases/abrir-auditoria.use-case';
import { IniciarExecucaoUseCase } from './use-cases/iniciar-execucao.use-case';
import { ConcluirAuditoriaUseCase } from './use-cases/concluir-auditoria.use-case';
import { SuspenderAuditoriaUseCase } from './use-cases/suspender-auditoria.use-case';

type MockAuditoriasService = {
  [K in keyof AuditoriasService]: jest.Mock;
};

describe('AuditoriasController', () => {
  let controller: AuditoriasController;
  let service: MockAuditoriasService;
  let abrirUseCase: any;
  let iniciarUseCase: any;
  let concluirUseCase: any;
  let suspenderUseCase: any;

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
      providers: [
        { provide: AuditoriasService, useValue: mockService },
        { provide: AbrirAuditoriaUseCase, useValue: { execute: jest.fn() } },
        { provide: IniciarExecucaoUseCase, useValue: { execute: jest.fn() } },
        { provide: ConcluirAuditoriaUseCase, useValue: { execute: jest.fn() } },
        { provide: SuspenderAuditoriaUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AuditoriasController>(AuditoriasController);
    service = module.get(AuditoriasService) as MockAuditoriasService;
    abrirUseCase = module.get(AbrirAuditoriaUseCase);
    iniciarUseCase = module.get(IniciarExecucaoUseCase);
    concluirUseCase = module.get(ConcluirAuditoriaUseCase);
    suspenderUseCase = module.get(SuspenderAuditoriaUseCase);
  });

  describe('POST /auditorias', () => {
    const mockReq = (sub = 'user-1') => ({ user: { sub, email: 'test@test.com', roles: ['P01'] } }) as any;

    it('deve abrir auditoria via AbrirAuditoriaUseCase', async () => {
      abrirUseCase.execute.mockResolvedValue({
        id: 'aud-1',
        numero: 'AUD-2026-0001',
        status: 'ABERTA',
        itemPlanoId: 'item-1',
        sigilosa: false,
      });
      const result = await controller.create(mockReq(), {
        itemPlanoId: 'item-1',
        observacoes: 'Teste',
        sigilosa: false,
      });
      expect(result).toHaveProperty('numero', 'AUD-2026-0001');
      expect(abrirUseCase.execute).toHaveBeenCalledWith(
        { itemPlanoId: 'item-1', observacoes: 'Teste', sigilosa: false },
        'user-1',
      );
    });
  });

  describe('GET /auditorias', () => {
    it('deve listar auditorias com filtro opcional', async () => {
      service.findAll.mockResolvedValue([{ id: '1', numero: 'AUD-001', status: 'EM_EXECUCAO' }]);
      const result = await controller.findAll('EM_EXECUCAO', undefined, undefined, {
        user: { sub: 'user-uuid', email: 'test@test.com', roles: ['P01'] },
      } as any);
      expect(result).toHaveLength(1);
    });
  });

  describe('GET /auditorias/:id', () => {
    it('deve retornar auditoria por ID', async () => {
      service.findOne.mockResolvedValue({ id: '1', numero: 'AUD-001', status: 'ABERTA' });
      const result = await controller.findOne('1');
      expect(result).toHaveProperty('numero');
    });
  });

  describe('POST /auditorias/:id/iniciar', () => {
    it('deve usar IniciarExecucaoUseCase', async () => {
      iniciarUseCase.execute.mockResolvedValue({ id: '1', status: 'EM_EXECUCAO' });
      const result = await controller.iniciarExecucao('1');
      expect(result).toHaveProperty('status', 'EM_EXECUCAO');
      expect(iniciarUseCase.execute).toHaveBeenCalledWith('1');
    });
  });

  describe('POST /auditorias/:id/concluir', () => {
    it('deve usar ConcluirAuditoriaUseCase', async () => {
      concluirUseCase.execute.mockResolvedValue({ id: '1', status: 'CONCLUIDA' });
      const result = await controller.concluir('1');
      expect(result).toHaveProperty('status', 'CONCLUIDA');
      expect(concluirUseCase.execute).toHaveBeenCalledWith('1');
    });
  });

  describe('POST /auditorias/:id/suspender', () => {
    it('deve usar SuspenderAuditoriaUseCase', async () => {
      suspenderUseCase.execute.mockResolvedValue({ id: '1', status: 'SUSPENSA', motivoSuspensao: 'Falta de pessoal' });
      const result = await controller.suspender('1', 'Falta de pessoal');
      expect(result).toHaveProperty('status', 'SUSPENSA');
      expect(suspenderUseCase.execute).toHaveBeenCalledWith('1', 'Falta de pessoal');
    });
  });

  describe('POST /auditorias/:id/comunicado', () => {
    it('deve gerar comunicado de auditoria', async () => {
      const mockReq = { user: { sub: 'user-1', email: 'test@test.com', roles: ['P01'] } };
      service.gerarComunicado.mockResolvedValue({ id: 'com-1', numero: 'COM-2026-0001', conteudo: '...' });
      const result = await controller.gerarComunicado(mockReq as any, 'aud-1');
      expect(result).toHaveProperty('numero');
      expect(service.gerarComunicado).toHaveBeenCalledWith('aud-1', 'user-1');
    });
  });

  describe('POST /auditorias/:id/evidencias', () => {
    it('deve adicionar evidência com arquivo', async () => {
      service.criarEvidencia.mockResolvedValue({
        id: 'ev-1',
        tipo: 'DOCUMENTO',
        descricao: 'Relatório X',
        arquivoPath: '/uploads/file.pdf',
      });
      const result = await controller.criarEvidencia('aud-1', { tipo: 'DOCUMENTO', descricao: 'Relatório X' }, {
        path: '/uploads/file.pdf',
      } as Express.Multer.File);
      expect(result).toHaveProperty('tipo', 'DOCUMENTO');
    });
  });

  describe('GET /auditorias/:id/papeis-trabalho', () => {
    it('deve listar papéis de trabalho', async () => {
      service.listarPapeisTrabalho.mockResolvedValue([{ id: 'pt-1', codigo: 'PT-001' }]);
      const result = await controller.listarPapeisTrabalho('aud-1');
      expect(result).toHaveLength(1);
    });
  });
});
