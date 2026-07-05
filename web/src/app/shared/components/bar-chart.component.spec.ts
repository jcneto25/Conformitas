import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BarChartComponent, BarItem } from './bar-chart.component';

describe('BarChartComponent', () => {
  let fixture: ComponentFixture<BarChartComponent>;
  let component: BarChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
  });

  const sampleData: BarItem[] = [
    { label: 'EM_EXECUCAO', value: 2, color: '#316bf3' },
    { label: 'CONCLUIDA', value: 3, color: '#16a34a' },
    { label: 'SUSPENSA', value: 1, color: '#d97706' },
  ];

  it('should render bars for each data item', () => {
    component.data = sampleData;
    fixture.detectChanges();

    const bars = fixture.debugElement.queryAll(By.css('[role="img"]'));
    expect(bars.length).toBe(3);
  });

  it('should render labels below bars', () => {
    component.data = sampleData;
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('EM_EXECUCAO');
    expect(el.textContent).toContain('CONCLUIDA');
    expect(el.textContent).toContain('SUSPENSA');
  });

  it('should render values above bars', () => {
    component.data = sampleData;
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('2');
    expect(el.textContent).toContain('3');
    expect(el.textContent).toContain('1');
  });

  it('should use default color when none provided', () => {
    component.data = [{ label: 'A', value: 5 }];
    fixture.detectChanges();

    const bar = fixture.debugElement.query(By.css('[role="img"]'));
    expect(bar.styles['background']).toBe('rgb(26, 58, 92)');
  });

  it('should use provided color', () => {
    component.data = [{ label: 'A', value: 5, color: '#ff0000' }];
    fixture.detectChanges();

    const bar = fixture.debugElement.query(By.css('[role="img"]'));
    expect(bar.styles['background']).toBe('rgb(255, 0, 0)');
  });

  it('should scale bars to max value (100%)', () => {
    component.data = [{ label: 'A', value: 10 }];
    fixture.detectChanges();

    const bar = fixture.debugElement.query(By.css('[role="img"]'));
    expect(bar.styles['height']).toBe('100%');
  });

  it('should scale smaller bars proportionally', () => {
    component.data = [
      { label: 'A', value: 3 },
      { label: 'B', value: 1 },
    ];
    fixture.detectChanges();

    const bars = fixture.debugElement.queryAll(By.css('[role="img"]'));
    expect(bars[0].styles['height']).toBe('100%');
    expect(parseInt(bars[1].styles['height'] as string)).toBe(33);
  });

  it('should use custom height', () => {
    component.data = sampleData;
    component.height = 300;
    fixture.detectChanges();

    const container = fixture.debugElement.nativeElement.querySelector('.flex.items-end');
    expect(container.style.height).toBe('300px');
  });

  it('should default to 180px height', () => {
    component.data = sampleData;
    fixture.detectChanges();

    const container = fixture.debugElement.nativeElement.querySelector('.flex.items-end');
    expect(container.style.height).toBe('180px');
  });

  it('should handle empty data gracefully', () => {
    component.data = [];
    fixture.detectChanges();

    const bars = fixture.debugElement.queryAll(By.css('[role="img"]'));
    expect(bars.length).toBe(0);
  });
});
