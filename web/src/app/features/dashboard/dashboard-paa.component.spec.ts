import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { provideCharts } from 'ng2-charts';
import { ApiService } from '../../core/services/api.service';
import { DashboardPaaComponent } from './dashboard-paa.component';

describe('DashboardPaaComponent', () => {
  let fixture: ComponentFixture<DashboardPaaComponent>;
  let component: DashboardPaaComponent;
  let apiSpy: jasmine.SpyObj<ApiService>;

  const mockData = {
    totalPlanos: 3,
    planosAprovados: 2,
    totalHorasDisponiveis: 480,
    totalHorasAlocadas: 360,
    auditoriasConcluidas: 4,
    planejamentoPercentual: 75,
  };

  function setup(mock = mockData) {
    apiSpy.getDashboardPaa.and.returnValue(Promise.resolve(mock));
    fixture = TestBed.createComponent(DashboardPaaComponent);
    component = fixture.componentInstance;
  }

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['getDashboardPaa', 'exportarDashboard']);
    apiSpy.exportarDashboard.and.returnValue(Promise.resolve(new Blob()));

    await TestBed.configureTestingModule({
      imports: [DashboardPaaComponent, FormsModule, NoopAnimationsModule],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        provideCharts(),
      ],
    }).compileComponents();
  });

  it('should fetch PAA data on init', async () => {
    setup();
    await component.carregar();
    expect(apiSpy.getDashboardPaa).toHaveBeenCalledWith({ ano: 2026 });
  });

  it('should set dados from API', async () => {
    setup();
    await component.carregar();
    expect(component.dados.totalPlanos).toBe(3);
    expect(component.dados.planosAprovados).toBe(2);
    expect(component.dados.planejamentoPercentual).toBe(75);
  });

  it('should build planejado bar chart data', async () => {
    setup();
    await component.carregar();
    expect(component.planejadoBarData.labels).toEqual(['Planejado', 'Executado']);
    expect(component.planejadoBarData.datasets[0].data).toEqual([3, 4]);
  });

  it('should export PDF via API', async () => {
    setup();
    await component.carregar();
    await component.exportar('PDF');
    expect(apiSpy.exportarDashboard).toHaveBeenCalledWith('paa', 'PDF', { ano: 2026 });
  });

  it('should export XLSX via API', async () => {
    setup();
    await component.carregar();
    await component.exportar('XLSX');
    expect(apiSpy.exportarDashboard).toHaveBeenCalledWith('paa', 'XLSX', { ano: 2026 });
  });

  it('should have Math exposed for template', () => {
    setup();
    expect(component.Math).toBe(Math);
  });

  it('should handle API error gracefully', async () => {
    apiSpy.getDashboardPaa.and.returnValue(Promise.reject('error'));
    fixture = TestBed.createComponent(DashboardPaaComponent);
    component = fixture.componentInstance;
    await component.carregar();
    expect(component.loading).toBeFalse();
    expect(component.dados).toEqual({});
  });
});
