import { Test, TestingModule } from '@nestjs/testing';
import { RecomendacoesSchedule } from './recomendacoes.schedule';
import { RecomendacoesService } from './recomendacoes.service';

describe('RecomendacoesSchedule', () => {
  let schedule: RecomendacoesSchedule;
  let service: { verificarVencidas: jest.Mock; escalarVencidas: jest.Mock };

  beforeEach(async () => {
    service = { verificarVencidas: jest.fn(), escalarVencidas: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecomendacoesSchedule, { provide: RecomendacoesService, useValue: service }],
    }).compile();
    schedule = module.get<RecomendacoesSchedule>(RecomendacoesSchedule);
  });

  it('delegar verificarVencidas ao service (com vencidas)', async () => {
    service.verificarVencidas.mockResolvedValue({ vencidas: 2, notificados: ['P01', 'P06'] });
    await schedule.verificarVencidas();
    expect(service.verificarVencidas).toHaveBeenCalled();
  });

  it('delegar verificarVencidas ao service (sem vencidas)', async () => {
    service.verificarVencidas.mockResolvedValue({ vencidas: 0, notificados: [] });
    await schedule.verificarVencidas();
    expect(service.verificarVencidas).toHaveBeenCalled();
  });

  it('delegar escalarVencidas ao service', async () => {
    service.escalarVencidas.mockResolvedValue({ escaladas: 1, notificar: ['P01'], recomendacoes: [] });
    await schedule.escalarVencidas();
    expect(service.escalarVencidas).toHaveBeenCalled();
  });
});
