import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiCardComponent, KpiAccent } from './kpi-card.component';
import { By } from '@angular/platform-browser';

describe('KpiCardComponent', () => {
  let component: KpiCardComponent;
  let fixture: ComponentFixture<KpiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiCardComponent);
    component = fixture.componentInstance;
    component.label = 'Auditorias Realizadas';
    component.value = 42;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the label', () => {
    const labelEl = fixture.debugElement.query(By.css('.text-text-sec.text-sm'));
    expect(labelEl).toBeTruthy();
    expect(labelEl.nativeElement.textContent.trim()).toBe('Auditorias Realizadas');
  });

  it('should display the value', () => {
    const valueEl = fixture.debugElement.query(By.css('.text-3xl.font-bold'));
    expect(valueEl).toBeTruthy();
    expect(valueEl.nativeElement.textContent.trim()).toBe('42');
  });

  it('should display icon when provided', () => {
    component.icon = 'assignment';
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('mat-icon.text-3xl'));
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.textContent.trim()).toBe('assignment');
  });

  it('should not render icon when not provided', () => {
    component.icon = '';
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('mat-icon.text-3xl'));
    expect(icon).toBeNull();
  });

  it('should display sub text when provided', () => {
    component.sub = 'Últimos 12 meses';
    fixture.detectChanges();
    const subEl = fixture.debugElement.query(By.css('.text-xs'));
    expect(subEl).toBeTruthy();
    expect(subEl.nativeElement.textContent.trim()).toBe('Últimos 12 meses');
  });

  it('should not render sub when not provided', () => {
    component.sub = '';
    fixture.detectChanges();
    // There should be only one .mt-0.5 element if sub is present
    const subEl = fixture.debugElement.query(By.css('.text-xs.mt-0\\.5'));
    expect(subEl).toBeNull();
  });

  it('should display positive delta with trending_up icon', () => {
    component.delta = 12;
    fixture.detectChanges();
    const deltaEl = fixture.debugElement.query(By.css('.inline-flex'));
    expect(deltaEl).toBeTruthy();
    expect(deltaEl.nativeElement.textContent.trim()).toContain('+12%');
    const icon = deltaEl.query(By.css('mat-icon'));
    expect(icon.nativeElement.textContent.trim()).toBe('trending_up');
  });

  it('should display negative delta with trending_down icon', () => {
    component.delta = -5;
    fixture.detectChanges();
    const deltaEl = fixture.debugElement.query(By.css('.inline-flex'));
    expect(deltaEl).toBeTruthy();
    expect(deltaEl.nativeElement.textContent.trim()).toContain('-5%');
    const icon = deltaEl.query(By.css('mat-icon'));
    expect(icon.nativeElement.textContent.trim()).toBe('trending_down');
  });

  it('should display delta label when provided', () => {
    component.delta = 8;
    component.deltaLabel = 'vs. período anterior';
    fixture.detectChanges();
    const deltaEl = fixture.debugElement.query(By.css('.inline-flex'));
    expect(deltaEl.nativeElement.textContent.trim()).toContain('vs. período anterior');
  });

  it('should not render delta when null', () => {
    component.delta = null;
    fixture.detectChanges();
    const deltaEl = fixture.debugElement.query(By.css('.inline-flex'));
    expect(deltaEl).toBeNull();
  });

  it('should show skeleton loader when loading', () => {
    component.loading = true;
    fixture.detectChanges();
    const skeleton = fixture.debugElement.query(By.css('.animate-pulse'));
    expect(skeleton).toBeTruthy();
    const valueEl = fixture.debugElement.query(By.css('.text-3xl.font-bold'));
    expect(valueEl.nativeElement.textContent.trim()).toBe('');
  });

  it('should hide skeleton when not loading', () => {
    component.loading = false;
    fixture.detectChanges();
    const skeleton = fixture.debugElement.query(By.css('.animate-pulse'));
    expect(skeleton).toBeNull();
  });

  it('should apply primary border by default', () => {
    expect(component.cardClass).toContain('border-primary');
  });

  it('should apply correct accent border and icon classes', () => {
    const accents: { accent: KpiAccent; borderClass: string; iconClass: string }[] = [
      { accent: 'success', borderClass: 'border-success', iconClass: 'text-success' },
      { accent: 'warning', borderClass: 'border-warning', iconClass: 'text-warning' },
      { accent: 'critical', borderClass: 'border-critical', iconClass: 'text-critical' },
      { accent: 'info', borderClass: 'border-info', iconClass: 'text-info' },
      { accent: 'primary', borderClass: 'border-primary', iconClass: 'text-primary' },
    ];

    for (const { accent, borderClass, iconClass: expectedIconClass } of accents) {
      component.accent = accent;
      expect(component.cardClass).toContain(borderClass);
      expect(component.iconClass).toContain(expectedIconClass);
    }
  });

  it('should apply success color for positive delta', () => {
    component.delta = 10;
    expect(component.deltaClass).toContain('text-success');
  });

  it('should apply critical color for negative delta', () => {
    component.delta = -3;
    expect(component.deltaClass).toContain('text-critical');
  });
});