import { Test, TestingModule } from '@nestjs/testing';
import { IniciarExecucaoUseCase } from './iniciar-execucao.use-case';
import { AUDITORIA_REPOSITORY } from '../repositories/auditoria.repository';

describe('IniciarExecucaoUseCase', () => {
  let useCase: IniciarExecucaoUseCase;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IniciarExecucaoUseCase,
        { provide: AUDITORIA_REPOSITORY, useValue: { findUnique: jest.fn(), update: jest.fn() } },
      ],
    }).compile();
    useCase = module.get<IniciarExecucaoUseCase>(IniciarExecucaoUseCase);
    repo = module.get(AUDITORIA_REPOSITORY);
  });

  it('deve iniciar execução de auditoria ABERTA', async () => {
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
    repo.update.mockResolvedValue({ id: '1', status: 'EM_EXECUCAO', dataInicio: expect.any(Date) });
    const result = await useCase.execute('1');
    expect(repo.update).toHaveBeenCalledWith('1', expect.objectContaining({ status: 'EM_EXECUCAO' }));
  });

  it('deve rejeitar auditoria CONCLUIDA', async () => {
    repo.findUnique.mockResolvedValue({
      id: '1',
      numero: 'AUD-001',
      status: 'CONCLUIDA',
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

  it('deve rejeitar auditoria não encontrada', async () => {
    repo.findUnique.mockResolvedValue(null);
    await expect(useCase.execute('x')).rejects.toThrow('Auditoria não encontrada');
  });
});
