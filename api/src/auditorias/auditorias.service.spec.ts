import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuditoriasService } from './auditorias.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AUDITORIA_REPOSITORY } from './repositories/auditoria.repository';

const mockRepo = () => ({ count: jest.fn(), create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() });

describe('AuditoriasService', () => {
  let service: AuditoriasService;
  let auditRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditoriasService,
        { provide: AUDITORIA_REPOSITORY, useValue: mockRepo() },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();
    service = module.get<AuditoriasService>(AuditoriasService);
    auditRepo = module.get(AUDITORIA_REPOSITORY);
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
    it('deve rejeitar', async () => {
      auditRepo.findUnique.mockResolvedValue({ id: '1', status: 'CONCLUIDA' });
      await expect(service.iniciarExecucao('1')).rejects.toThrow(BadRequestException);
    });
  });
});
