import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuditoriasService } from './auditorias.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  AUDITORIA_REPOSITORY,
  COMUNICADO_REPOSITORY,
  EVIDENCIA_REPOSITORY,
  PAPEL_TRABALHO_REPOSITORY,
  REQUISICAO_REPOSITORY,
} from './repositories/auditoria.repository';

const mockRepo = () => ({
  count: jest.fn(),
  create: jest.fn(),
  findMany: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
});
const mockChildRepo = () => ({ count: jest.fn(), create: jest.fn(), findMany: jest.fn() });

describe('AuditoriasService', () => {
  let service: AuditoriasService;
  let auditRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditoriasService,
        { provide: AUDITORIA_REPOSITORY, useValue: mockRepo() },
        { provide: COMUNICADO_REPOSITORY, useValue: mockChildRepo() },
        { provide: EVIDENCIA_REPOSITORY, useValue: mockChildRepo() },
        { provide: PAPEL_TRABALHO_REPOSITORY, useValue: mockChildRepo() },
        { provide: REQUISICAO_REPOSITORY, useValue: mockChildRepo() },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();
    service = module.get<AuditoriasService>(AuditoriasService);
    auditRepo = module.get(AUDITORIA_REPOSITORY);
  });

  describe('create', () => {
    it('deve abrir auditoria', async () => {
      auditRepo.findUnique = jest.fn().mockImplementation((id: string, opts?: any) => {
        if (opts?.include)
          return {
            id: 'item-1',
            objetivo: 'Auditar',
            escopo: 'Sec',
            universo: { unidadeResponsavel: 'SEC' },
            plano: { status: 'APROVADO' },
          };
        if (id) return { id: id, numero: 'audit-test', unidadeAuditada: 'SEC', objetivo: 'Auditar' };
        return null;
      });
      auditRepo.count.mockResolvedValue(0);
      auditRepo.create.mockResolvedValue({
        id: 'aud-1',
        numero: 'AUD-2026-0001',
        status: 'ABERTA',
        unidadeAuditada: 'SEC',
        objetivo: 'Auditar',
      });
      const result = await service.create({ itemPlanoId: 'item-1' } as any, 'user-1');
      expect(result.status).toBe('ABERTA');
    });
  });

  describe('findAll', () => {
    it('deve listar auditorias', async () => {
      auditRepo.findMany.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });
  });

  describe('iniciarExecucao', () => {
    it('deve iniciar', async () => {
      auditRepo.findUnique.mockResolvedValue({ id: '1', status: 'ABERTA' });
      auditRepo.update.mockResolvedValue({ id: '1', status: 'EM_EXECUCAO' });
      const r = await service.iniciarExecucao('1');
      expect(r.status).toBe('EM_EXECUCAO');
    });
    it('deve rejeitar status inválido', async () => {
      auditRepo.findUnique.mockResolvedValue({ id: '1', status: 'CONCLUIDA' });
      await expect(service.iniciarExecucao('1')).rejects.toThrow(BadRequestException);
    });
  });
});
