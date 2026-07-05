import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { provideCharts } from 'ng2-charts';
import { ApiService } from '../../core/services/api.service';
import { DashboardRecomendacoesComponent } from './dashboard-recomendacoes.component';

describe('DashboardRecomendacoesComponent', () => {
  let fixture: ComponentFixture<DashboardRecomendacoesComponent>;
  let component: DashboardRecomendacoesComponent;
  let apiSpy: jasmine.SpyObj<ApiService>;

  const mockData = {
    total: 10,
    porStatus: { PENDENTE: 4, EM_ANDAMENTO: 3, CUMPRIDA: 2, VENCIDA: 1 },
    porCriticidade: { ALTA: 3, MEDIA: 5, BAIXA: 2 },
    vencidas: 1,
    noPrazo: 9,
  };

  function setup(mock = mockData) {
    apiSpy.getDashboardRecomendacoes.and.returnValue(Promise.resolve(mock));
    fixture = TestBed.createComponent(DashboardRecomendacoesComponent);
    component = fixture.componentInstance;
  }

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['getDashboardRecomendacoes']);

    await TestBed.configureTestingModule({
      imports: [DashboardRecomendacoesComponent, FormsModule, NoopAnimationsModule],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        provideCharts(),
      ],
    }).compileComponents();
  });

  it('should fetch recomendacoes data', async () => {
    setup();
    await component.carregar();
    expect(apiSpy.getDashboardRecomendacoes).toHaveBeenCalled();
  });

  it('should set dados correctly', async () => {
    setup();
    await component.carregar();
    expect(component.dados.total).toBe(10);
    expect(component.dados.vencidas).toBe(1);
    expect(component.dados.noPrazo).toBe(9);
  });

  it('should build status doughnut chart data', async () => {
    setup();
    await component.carregar();
    expect(component.statusDoughnutData.labels).toContain('PENDENTE');
    expect(component.statusDoughnutData.datasets[0].data).toContain(4);
  });

  it('should build criticidade bar chart data', async () => {
    setup();
    await component.carregar();
    expect(component.criticidadeBarData.labels).toContain('ALTA');
    expect(component.criticidadeBarData.datasets[0].data).toContain(3);
  });

  it('should have status and criticidade keys', async () => {
    setup();
    await component.carregar();
    expect(component.statusKeys.length).toBeGreaterThan(0);
    expect(component.criticidadeKeys.length).toBeGreaterThan(0);
  });

  it('should handle empty data gracefully', async () => {
    const emptyData: any = { total: 0, porStatus: {}, porCriticidade: {}, vencidas: 0, noPrazo: 0 };
    setup(emptyData);
    await component.carregar();
    expect(component.statusKeys.length).toBe(0);
    expect(component.criticidadeKeys.length).toBe(0);
  });

  it('should handle API error gracefully', async () => {
    apiSpy.getDashboardRecomendacoes.and.returnValue(Promise.reject('error'));
    fixture = TestBed.createComponent(DashboardRecomendacoesComponent);
    component = fixture.componentInstance;
    await component.carregar();
    expect(component.loading).toBeFalse();
    expect(component.dados.total).toBe(0);
  });
});
