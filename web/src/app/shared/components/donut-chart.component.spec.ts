import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DonutChartComponent, DonutSlice } from './donut-chart.component';

describe('DonutChartComponent', () => {
  let fixture: ComponentFixture<DonutChartComponent>;
  let component: DonutChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonutChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonutChartComponent);
    component = fixture.componentInstance;
  });

  const sampleData: DonutSlice[] = [
    { label: 'EM_ANDAMENTO', value: 4, color: '#2563eb' },
    { label: 'PENDENTE', value: 3, color: '#16a34a' },
    { label: 'CUMPRIDA', value: 2, color: '#d97706' },
    { label: 'VENCIDA', value: 1, color: '#dc2626' },
  ];

  it('should display total in center', () => {
    component.data = sampleData;
    fixture.detectChanges();

    const centerTotal = fixture.debugElement.query(By.css('.text-2xl'));
    expect(centerTotal.nativeElement.textContent.trim()).toBe('10');
  });

  it('should display custom center label', () => {
    component.data = sampleData;
    component.centerLabel = 'Recomendações';
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('Recomendações');
  });

  it('should default center label to "Total"', () => {
    component.data = sampleData;
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('Total');
  });

  it('should render SVG with correct size', () => {
    component.data = sampleData;
    component.size = 200;
    fixture.detectChanges();

    const svg = fixture.debugElement.query(By.css('svg'));
    expect(svg.attributes['width']).toBe('200');
    expect(svg.attributes['height']).toBe('200');
  });

  it('should render background circle and segment circles', () => {
    component.data = sampleData;
    fixture.detectChanges();

    const circles = fixture.debugElement.queryAll(By.css('circle'));
    expect(circles.length).toBe(5); // 1 bg + 4 segments
  });

  it('should show legend with values and percentages by default', () => {
    component.data = sampleData;
    fixture.detectChanges();

    const legendItems = fixture.debugElement.queryAll(By.css('li'));
    expect(legendItems.length).toBe(4);

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('EM_ANDAMENTO');
    expect(el.textContent).toContain('PENDENTE');
    expect(el.textContent).toContain('40%');
    expect(el.textContent).toContain('30%');
  });

  it('should hide legend when showLegend is false', () => {
    component.data = sampleData;
    component.showLegend = false;
    fixture.detectChanges();

    const legendItems = fixture.debugElement.queryAll(By.css('li'));
    expect(legendItems.length).toBe(0);
  });

  it('should filter out zero-value slices', () => {
    component.data = [
      { label: 'A', value: 5, color: '#000' },
      { label: 'B', value: 0, color: '#fff' },
      { label: 'C', value: 3, color: '#333' },
    ];
    fixture.detectChanges();

    const circles = fixture.debugElement.queryAll(By.css('circle'));
    expect(circles.length).toBe(3); // 1 bg + 2 segments (B is filtered)
  });

  it('should handle empty data gracefully', () => {
    component.data = [];
    fixture.detectChanges();

    const centerTotal = fixture.debugElement.query(By.css('.text-2xl'));
    expect(centerTotal.nativeElement.textContent.trim()).toBe('0');

    const circles = fixture.debugElement.queryAll(By.css('circle'));
    expect(circles.length).toBe(1); // bg circle only
  });

  it('should compute percentages correctly', () => {
    component.data = sampleData;
    const segments: any[] = (component as any).segments;
    fixture.detectChanges();

    const seg = component['segments'];
    expect(seg[0].pct).toBe(40); // 4/10
    expect(seg[1].pct).toBe(30); // 3/10
    expect(seg[2].pct).toBe(20); // 2/10
    expect(seg[3].pct).toBe(10); // 1/10
  });
});
