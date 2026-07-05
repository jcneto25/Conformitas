import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideCharts } from 'ng2-charts';
import { ApiService } from '../../core/services/api.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let apiSpy: jasmine.SpyObj<ApiService>;

  const mockExecucaoData = {
    total: 5,
    porStatus: { EM_EXECUCAO: 2, CONCLUIDA: 3 },
    porTipo: {},
    porUnidade: {},
  };

  const mockRecomendacoesData = {
    total: 10,
    porStatus: { PENDENTE: 4, EM_ANDAMENTO: 3, CUMPRIDA: 2, VENCIDA: 1 },
    porCriticidade: {},
    vencidas: 1,
    noPrazo: 9,
  };

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', [
      'getDashboardExecucao',
      'getDashboardRecomendacoes',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        provideCharts(),
      ],
    }).compileComponents();
  });

  function setup(mockExec = mockExecucaoData, mockRec = mockRecomendacoesData) {
    apiSpy.getDashboardExecucao.and.returnValue(Promise.resolve(mockExec));
    apiSpy.getDashboardRecomendacoes.and.returnValue(Promise.resolve(mockRec));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  }

  it('should fetch data on init', async () => {
    setup();
    await component.carregar();
    fixture.detectChanges();

    expect(apiSpy.getDashboardExecucao).toHaveBeenCalled();
    expect(apiSpy.getDashboardRecomendacoes).toHaveBeenCalled();
  });

  it('should not be loading after data fetch', async () => {
    setup();
    await component.carregar();
    expect(component.loading).toBeFalse();
  });

  it('should display total auditorias in KPI', async () => {
    setup();
    await component.carregar();

    expect(component.totalAuditorias).toBe(5);
    expect(component.auditoriasEmExecucao).toBe(2);
    expect(component.auditoriasConcluidas).toBe(3);
  });

  it('should display recomendacoes KPIs', async () => {
    setup();
    await component.carregar();

    expect(component.totalRecomendacoes).toBe(10);
    expect(component.recomendacoesVencidas).toBe(1);
  });

  it('should compute monitoradas as PENDENTE + EM_ANDAMENTO', async () => {
    setup();
    await component.carregar();

    expect(component.recomendacoesMonitoradas).toBe(7);
  });

  it('should build bar chart data for auditorias', async () => {
    setup();
    await component.carregar();

    expect(component.auditoriasBarData.labels).toContain('EM_EXECUCAO');
    expect(component.auditoriasBarData.labels).toContain('CONCLUIDA');
    expect(component.auditoriasBarData.datasets[0].data).toEqual([2, 3]);
  });

  it('should build doughnut chart data for recomendacoes', async () => {
    setup();
    await component.carregar();

    expect(component.recomendacoesDoughnutData.labels).toContain('PENDENTE');
    expect(component.recomendacoesDoughnutData.datasets[0].data).toContain(4);
  });

  it('should handle API errors by falling back to zero data', async () => {
    apiSpy.getDashboardExecucao.and.returnValue(Promise.reject('error'));
    apiSpy.getDashboardRecomendacoes.and.returnValue(Promise.reject('error'));
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.totalAuditorias).toBe(0);
    expect(component.totalRecomendacoes).toBe(0);
  });

  it('should render year filter', () => {
    setup();
    fixture.detectChanges();

    const select = fixture.debugElement.query(By.css('mat-select'));
    expect(select).not.toBeNull();
  });
});
