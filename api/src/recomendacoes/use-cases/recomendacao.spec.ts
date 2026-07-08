import { Test, TestingModule } from '@nestjs/testing';
import { VerificarVencidasUseCase } from './verificar-vencidas.use-case';
import { EscalarVencidasUseCase } from './escalar-vencidas.use-case';
import { RECOMENDACAO_REPOSITORY } from '../repositories/recomendacao.repository';

describe('VerificarVencidasUseCase', () => {
  let useCase: VerificarVencidasUseCase;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerificarVencidasUseCase, { provide: RECOMENDACAO_REPOSITORY, useValue: { findMany: jest.fn(), update: jest.fn() } }],
    }).compile();
    useCase = module.get(VerificarVencidasUseCase);
    repo = module.get(RECOMENDACAO_REPOSITORY);
  });

  it('deve marcar como VENCIDA recomendações com prazo expirado', async () => {
    repo.findMany.mockResolvedValue([{ id: 'r1' }, { id: 'r2' }]);
    repo.update.mockResolvedValue({});
    const result = await useCase.execute();
    expect(result.vencidas).toBe(2);
    expect(repo.update).toHaveBeenCalledTimes(2);
  });

  it('deve retornar 0 quando não há vencidas', async () => {
    repo.findMany.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(result.vencidas).toBe(0);
  });
});

describe('EscalarVencidasUseCase', () => {
  let useCase: EscalarVencidasUseCase;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EscalarVencidasUseCase, { provide: RECOMENDACAO_REPOSITORY, useValue: { findMany: jest.fn() } }],
    }).compile();
    useCase = module.get(EscalarVencidasUseCase);
    repo = module.get(RECOMENDACAO_REPOSITORY);
  });

  it('deve listar vencidas de alta prioridade', async () => {
    repo.findMany.mockResolvedValue([{ id: 'r1', prioridade: 'ALTA' }]);
    const result = await useCase.execute();
    expect(result.escaladas).toBe(1);
  });
});
