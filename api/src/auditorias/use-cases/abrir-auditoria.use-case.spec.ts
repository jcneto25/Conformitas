import { Test, TestingModule } from '@nestjs/testing';
import { AbrirAuditoriaUseCase } from './abrir-auditoria.use-case';
import { AUDITORIA_REPOSITORY, COMUNICADO_REPOSITORY } from '../repositories/auditoria.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('AbrirAuditoriaUseCase', () => {
  let useCase: AbrirAuditoriaUseCase;
  let auditRepo: any;
  let comunicadoRepo: any;
  let eventEmitter: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    });
    const mockChildRepo = () => ({ count: jest.fn(), create: jest.fn(), findMany: jest.fn() });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbrirAuditoriaUseCase,
        { provide: AUDITORIA_REPOSITORY, useValue: mockRepo() },
        { provide: COMUNICADO_REPOSITORY, useValue: mockChildRepo() },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    useCase = module.get<AbrirAuditoriaUseCase>(AbrirAuditoriaUseCase);
    auditRepo = module.get(AUDITORIA_REPOSITORY);
    comunicadoRepo = module.get(COMUNICADO_REPOSITORY);
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('deve abrir auditoria e emitir evento', async () => {
    auditRepo.findUnique.mockResolvedValue({
      id: 'item-1',
      objetivo: 'Auditar finanças',
      escopo: 'Secretaria',
      universo: { unidadeResponsavel: 'SECRETARIA_X', objetivo: 'Auditar finanças', escopo: 'Secretaria' },
      plano: { status: 'APROVADO' },
    });
    auditRepo.count.mockResolvedValue(0);
    auditRepo.create.mockResolvedValue({
      id: 'aud-1',
      numero: 'AUD-2026-0001',
      status: 'ABERTA',
      tipo: 'CONFORMIDADE',
      forma: 'DIRETA',
      unidadeAuditada: 'SECRETARIA_X',
      objetivo: 'Auditar finanças',
      escopo: 'Secretaria',
      sigilosa: false,
      dataFimPrevista: null,
      dataInicio: null,
      dataFimReal: null,
      motivoSuspensao: null,
    });
    comunicadoRepo.count.mockResolvedValue(0);
    comunicadoRepo.create.mockResolvedValue({ id: 'com-1' });

    const result = await useCase.execute({ itemPlanoId: 'item-1' } as any, 'user-1');
    expect(result.status).toBe('ABERTA');
    expect(result.numero).toBe('AUD-2026-0001');
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'auditoria.aberta',
      expect.objectContaining({ numero: 'AUD-2026-0001' }),
    );
  });

  it('deve rejeitar item de plano não encontrado', async () => {
    auditRepo.findUnique.mockResolvedValue(null);
    await expect(useCase.execute({ itemPlanoId: 'x' } as any, 'u1')).rejects.toThrow('Item do plano não encontrado');
  });
});
