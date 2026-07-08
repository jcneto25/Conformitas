import { Test, TestingModule } from '@nestjs/testing';
import { RecomendacoesSchedule } from './recomendacoes.schedule';
import { VerificarVencidasUseCase } from './use-cases/verificar-vencidas.use-case';
import { EscalarVencidasUseCase } from './use-cases/escalar-vencidas.use-case';

describe('RecomendacoesSchedule', () => {
  let schedule: RecomendacoesSchedule;
  let verificarUC: { execute: jest.Mock };
  let escalarUC: { execute: jest.Mock };

  beforeEach(async () => {
    verificarUC = { execute: jest.fn() };
    escalarUC = { execute: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecomendacoesSchedule,
        { provide: VerificarVencidasUseCase, useValue: verificarUC },
        { provide: EscalarVencidasUseCase, useValue: escalarUC },
      ],
    }).compile();
    schedule = module.get<RecomendacoesSchedule>(RecomendacoesSchedule);
  });

  it('delegar verificarVencidas ao use case (com vencidas)', async () => {
    verificarUC.execute.mockResolvedValue({ vencidas: 2 });
    await schedule.verificarVencidas();
    expect(verificarUC.execute).toHaveBeenCalled();
  });

  it('delegar verificarVencidas ao use case (sem vencidas)', async () => {
    verificarUC.execute.mockResolvedValue({ vencidas: 0 });
    await schedule.verificarVencidas();
    expect(verificarUC.execute).toHaveBeenCalled();
  });

  it('delegar escalarVencidas ao use case', async () => {
    escalarUC.execute.mockResolvedValue({ escaladas: 1 });
    await schedule.escalarVencidas();
    expect(escalarUC.execute).toHaveBeenCalled();
  });
});
