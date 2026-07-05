import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { provideCharts } from 'ng2-charts';
import { ApiService } from '../../core/services/api.service';
import { DashboardExecucaoComponent } from './dashboard-execucao.component';

describe('DashboardExecucaoComponent', () => {
  let fixture: ComponentFixture<DashboardExecucaoComponent>;
  let component: DashboardExecucaoComponent;
  let apiSpy: jasmine.SpyObj<ApiService>;

  const mockData = {
    total: 5,
    porStatus: { EM_EXECUCAO: 2, CONCLUIDA: 2, ABERTA: 1 },
    porTipo: { CONFORMIDADE: 3, OPERACIONAL: 2 },
    porUnidade: { 'Secretaria A': 3, 'Secretaria B': 2 },
  };

  function setup(mock = mockData) {
    apiSpy.getDashboardExecucao.and.returnValue(Promise.resolve(mock));
    fixture = TestBed.createComponent(DashboardExecucaoComponent);
    component = fixture.componentInstance;
  }

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['getDashboardExecucao']);

    await TestBed.configureTestingModule({
      imports: [DashboardExecucaoComponent, FormsModule, NoopAnimationsModule],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        provideCharts(),
      ],
    }).compileComponents();
  });

  it('should fetch execucao data', async () => {
    setup();
    await component.carregar();
    expect(apiSpy.getDashboardExecucao).toHaveBeenCalled();
  });

  it('should set dados from API response', async () => {
    setup();
    await component.carregar();
    expect(component.dados.total).toBe(5);
    expect(component.dados.porStatus.EM_EXECUCAO).toBe(2);
  });

  it('should build status bar chart data', async () => {
    setup();
    await component.carregar();
    expect(component.statusBarData.labels).toContain('EM_EXECUCAO');
    expect(component.statusBarData.datasets[0].data).toContain(2);
  });

  it('should build tipo doughnut chart data', async () => {
    setup();
    await component.carregar();
    expect(component.tipoDoughnutData.labels).toContain('CONFORMIDADE');
    expect(component.tipoDoughnutData.labels).toContain('OPERACIONAL');
  });

  it('should build unidade bar chart data', async () => {
    setup();
    await component.carregar();
    expect(component.unidadeBarData.labels).toContain('Secretaria A');
  });

  it('should have data keys for template checks', async () => {
    setup();
    await component.carregar();
    expect(component.statusKeys.length).toBeGreaterThan(0);
    expect(component.tipoKeys.length).toBeGreaterThan(0);
    expect(component.unidadeKeys.length).toBeGreaterThan(0);
  });

  it('should handle empty data gracefully', async () => {
    const emptyData: any = { total: 0, porStatus: {}, porTipo: {}, porUnidade: {} };
    setup(emptyData);
    await component.carregar();
    expect(component.statusKeys.length).toBe(0);
    expect(component.tipoKeys.length).toBe(0);
  });

  it('should handle API error gracefully', async () => {
    apiSpy.getDashboardExecucao.and.returnValue(Promise.reject('error'));
    fixture = TestBed.createComponent(DashboardExecucaoComponent);
    component = fixture.componentInstance;
    await component.carregar();
    expect(component.loading).toBeFalse();
    expect(component.dados.total).toBe(0);
  });
});
