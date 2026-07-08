import { Test, TestingModule } from '@nestjs/testing';
import { ConcluirAuditoriaUseCase } from './concluir-auditoria.use-case';
import { AUDITORIA_REPOSITORY } from '../repositories/auditoria.repository';

describe('ConcluirAuditoriaUseCase', () => {
  let useCase: ConcluirAuditoriaUseCase;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcluirAuditoriaUseCase,
        { provide: AUDITORIA_REPOSITORY, useValue: { findUnique: jest.fn(), update: jest.fn() } },
      ],
    }).compile();
    useCase = module.get<ConcluirAuditoriaUseCase>(ConcluirAuditoriaUseCase);
    repo = module.get(AUDITORIA_REPOSITORY);
  });

  it('deve concluir auditoria EM_EXECUCAO', async () => {
    repo.findUnique.mockResolvedValue({
      id: '1',
      numero: 'AUD-001',
      status: 'EM_EXECUCAO',
      unidadeAuditada: 'SEC',
      objetivo: 'Auditar',
      itemPlanoId: 'ip1',
      tipo: 'CONFORMIDADE',
      forma: 'DIRETA',
      sigilosa: false,
      escopo: null,
      dataFimPrevista: null,
      dataInicio: new Date(),
      dataFimReal: null,
      motivoSuspensao: null,
      deletedAt: null,
    });
    repo.update.mockResolvedValue({ id: '1', status: 'CONCLUIDA' });
    const result = await useCase.execute('1');
    expect(repo.update).toHaveBeenCalledWith('1', expect.objectContaining({ status: 'CONCLUIDA' }));
  });

  it('deve rejeitar auditoria ABERTA', async () => {
    repo.findUnique.mockResolvedValue({
      id: '1',
      status: 'ABERTA',
      numero: 'AUD-001',
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
    await expect(useCase.execute('1')).rejects.toThrow('Transição inválida');
  });
});
