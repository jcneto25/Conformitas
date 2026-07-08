import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriasController } from './auditorias.controller';
import { AuditoriasService } from './auditorias.service';
import { EvidenciasService } from './evidencias.service';
import { PapeisTrabalhoService } from './papeis-trabalho.service';
import { RequisicoesService } from './requisicoes.service';
import { ComunicadosService } from './comunicados.service';
import { AbrirAuditoriaUseCase } from './use-cases/abrir-auditoria.use-case';
import { IniciarExecucaoUseCase } from './use-cases/iniciar-execucao.use-case';
import { ConcluirAuditoriaUseCase } from './use-cases/concluir-auditoria.use-case';
import { SuspenderAuditoriaUseCase } from './use-cases/suspender-auditoria.use-case';

type Mock = { [K: string]: jest.Mock };

describe('AuditoriasController', () => {
  let controller: AuditoriasController;
  let auditSvc: Mock;
  let abrirUC: any;
  let evidenciaSvc: any;

  beforeEach(async () => {
    auditSvc = { findAll: jest.fn(), findOne: jest.fn() } as any;
    abrirUC = { execute: jest.fn() };
    evidenciaSvc = { criar: jest.fn(), listar: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditoriasController],
      providers: [
        { provide: AuditoriasService, useValue: auditSvc },
        { provide: AbrirAuditoriaUseCase, useValue: abrirUC },
        { provide: IniciarExecucaoUseCase, useValue: { execute: jest.fn() } },
        { provide: ConcluirAuditoriaUseCase, useValue: { execute: jest.fn() } },
        { provide: SuspenderAuditoriaUseCase, useValue: { execute: jest.fn() } },
        { provide: EvidenciasService, useValue: evidenciaSvc },
        { provide: PapeisTrabalhoService, useValue: { criar: jest.fn(), listar: jest.fn() } },
        { provide: RequisicoesService, useValue: { criar: jest.fn(), listar: jest.fn() } },
        { provide: ComunicadosService, useValue: { gerar: jest.fn() } },
      ],
    }).compile();
    controller = module.get<AuditoriasController>(AuditoriasController);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); });

  describe('POST /auditorias', () => {
    it('deve abrir via AbrirAuditoriaUseCase', async () => {
      abrirUC.execute.mockResolvedValue({ id: 'aud-1', numero: 'AUD-001', status: 'ABERTA' });
      const req = { user: { sub: 'user-1', email: 'a@b.com', roles: ['P01'] } } as any;
      const result = await controller.create(req, { itemPlanoId: 'item-1' } as any);
      expect(result.numero).toBe('AUD-001');
    });
  });

  describe('GET /auditorias', () => {
    it('deve listar', async () => {
      auditSvc.findAll.mockResolvedValue([{ id: '1' }]);
      const result = await controller.findAll(undefined, undefined, undefined, { user: {} } as any);
      expect(result).toHaveLength(1);
    });
  });

  describe('POST /auditorias/:id/evidencias', () => {
    it('delegar para EvidenciasService', async () => {
      evidenciaSvc.criar.mockResolvedValue({ id: 'ev-1' });
      const result = await controller.criarEvidencia('aud-1', {} as any, { path: '/up.pdf' } as any);
      expect(result.id).toBe('ev-1');
    });
  });
});
