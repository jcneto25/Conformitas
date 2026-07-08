import { Test, TestingModule } from '@nestjs/testing';
import { SuspenderAuditoriaUseCase } from './suspender-auditoria.use-case';
import { AUDITORIA_REPOSITORY } from '../repositories/auditoria.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('SuspenderAuditoriaUseCase', () => {
  let useCase: SuspenderAuditoriaUseCase;
  let repo: any;
  let eventEmitter: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuspenderAuditoriaUseCase,
        { provide: AUDITORIA_REPOSITORY, useValue: { findUnique: jest.fn(), update: jest.fn() } },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();
    useCase = module.get<SuspenderAuditoriaUseCase>(SuspenderAuditoriaUseCase);
    repo = module.get(AUDITORIA_REPOSITORY);
    eventEmitter = module.get(EventEmitter2);
  });

  it('deve suspender auditoria e emitir evento', async () => {
    repo.findUnique.mockResolvedValue({
      id: '1',
      numero: 'AUD-001',
      status: 'ABERTA',
      unidadeAuditada: 'SEC',
      objetivo: 'Auditar',
      itemPlanoId: 'ip1',
      tipo: 'CONFORMIDADE',
      forma: 'DIRETA',
      sigilosa: false,
      escopo: null,
      dataFimPrevista: null,
      dataInicio: null,
      dataFimReal: null,
      motivoSuspensao: null,
      deletedAt: null,
    });
    repo.update.mockResolvedValue({ id: '1', status: 'SUSPENSA', motivoSuspensao: 'Motivo X' });
    const result = await useCase.execute('1', 'Motivo X');
    expect(repo.update).toHaveBeenCalledWith('1', expect.objectContaining({ status: 'SUSPENSA' }));
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'auditoria.suspensa',
      expect.objectContaining({ motivo: 'Motivo X' }),
    );
  });

  it('deve rejeitar auditoria não encontrada', async () => {
    repo.findUnique.mockResolvedValue(null);
    await expect(useCase.execute('x', 'motivo')).rejects.toThrow('Auditoria não encontrada');
  });
});
