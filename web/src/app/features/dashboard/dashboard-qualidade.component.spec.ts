import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { provideCharts } from 'ng2-charts';
import { ApiService } from '../../core/services/api.service';
import { DashboardQualidadeComponent } from './dashboard-qualidade.component';

describe('DashboardQualidadeComponent', () => {
  let fixture: ComponentFixture<DashboardQualidadeComponent>;
  let component: DashboardQualidadeComponent;
  let apiSpy: jasmine.SpyObj<ApiService>;

  const mockData = {
    totalAvaliacoes: 8,
    avaliacoesConcluidas: 5,
    mediaNota: 8.5,
    totalNaoConformidades: 6,
    naoConformidadesAbertas: 4,
    indicadores: [
      { id: 'ind-1', nome: 'Eficácia das Recomendações', valor: '75%', meta: '80%' },
      { id: 'ind-2', nome: 'Tempestividade das Auditorias', valor: '85%', meta: '90%' },
      { id: 'ind-3', nome: 'Cobertura do PAA', valor: '92%', meta: '90%' },
    ],
  };

  function setup(mock = mockData) {
    apiSpy.getDashboardQualidade.and.returnValue(Promise.resolve(mock));
    fixture = TestBed.createComponent(DashboardQualidadeComponent);
    component = fixture.componentInstance;
  }

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['getDashboardQualidade']);

    await TestBed.configureTestingModule({
      imports: [DashboardQualidadeComponent, FormsModule, NoopAnimationsModule],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        provideCharts(),
      ],
    }).compileComponents();
  });

  it('should fetch qualidade data', async () => {
    setup();
    await component.carregar();
    expect(apiSpy.getDashboardQualidade).toHaveBeenCalled();
  });

  it('should set dados correctly', async () => {
    setup();
    await component.carregar();
    expect(component.dados.totalAvaliacoes).toBe(8);
    expect(component.dados.avaliacoesConcluidas).toBe(5);
    expect(component.dados.mediaNota).toBe(8.5);
    expect(component.dados.naoConformidadesAbertas).toBe(4);
    expect(component.dados.indicadores.length).toBe(3);
  });

  it('should build NC doughnut chart data', async () => {
    setup();
    await component.carregar();
    expect(component.ncDoughnutData.labels).toEqual(['Abertas', 'Corrigidas']);
    expect(component.ncDoughnutData.datasets[0].data).toEqual([4, 2]);
  });

  it('should handle null mediaNota', async () => {
    const dadosNull: any = { ...mockData, mediaNota: null };
    setup(dadosNull);
    await component.carregar();
    expect(component.dados.mediaNota).toBeNull();
  });

  it('should handle empty indicadores', async () => {
    const dadosEmpty: any = { ...mockData, indicadores: [] };
    setup(dadosEmpty);
    await component.carregar();
    expect(component.dados.indicadores.length).toBe(0);
  });

  it('should handle zero Nao Conformidades', async () => {
    const dadosZero: any = { ...mockData, totalNaoConformidades: 0, naoConformidadesAbertas: 0 };
    setup(dadosZero);
    await component.carregar();
    const data = component.ncDoughnutData.datasets[0].data as number[];
    expect(data).toEqual([0, 0]);
  });

  it('should handle API error gracefully', async () => {
    apiSpy.getDashboardQualidade.and.returnValue(Promise.reject('error'));
    fixture = TestBed.createComponent(DashboardQualidadeComponent);
    component = fixture.componentInstance;
    await component.carregar();
    expect(component.loading).toBeFalse();
    expect(component.dados.totalAvaliacoes).toBe(0);
    expect(component.dados.indicadores).toEqual([]);
  });
});
