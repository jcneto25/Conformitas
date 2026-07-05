import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { KpiCardComponent } from './kpi-card.component';

describe('KpiCardComponent', () => {
  let fixture: ComponentFixture<KpiCardComponent>;
  let component: KpiCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiCardComponent);
    component = fixture.componentInstance;
  });

  it('should display label and value', () => {
    component.label = 'Total Auditorias';
    component.value = 42;
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('Total Auditorias');
    expect(el.textContent).toContain('42');
  });

  it('should show loading skeleton when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();

    const skeleton = fixture.debugElement.query(By.css('.animate-pulse'));
    expect(skeleton).not.toBeNull();
  });

  it('should hide value when loading', () => {
    component.loading = true;
    component.value = 42;
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).not.toContain('42');
  });

  it('should display icon when provided', () => {
    component.icon = 'check_circle';
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon).not.toBeNull();
    expect(icon.nativeElement.textContent).toContain('check_circle');
  });

  it('should not render icon when not provided', () => {
    component.icon = '';
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon).toBeNull();
  });

  it('should apply primary accent class by default', () => {
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('mat-card'));
    expect(card.classes['border-primary']).toBeTrue();
  });

  it('should apply success accent class', () => {
    component.accent = 'success';
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('mat-card'));
    expect(card.classes['border-success']).toBeTrue();
  });

  it('should apply critical accent class', () => {
    component.accent = 'critical';
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('mat-card'));
    expect(card.classes['border-critical']).toBeTrue();
  });

  it('should show positive delta with trending_up icon', () => {
    component.delta = 12;
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('+12%');
    expect(el.textContent).toContain('trending_up');
  });

  it('should show negative delta with trending_down icon', () => {
    component.delta = -5;
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('-5%');
    expect(el.textContent).toContain('trending_down');
  });

  it('should not show delta section when delta is null', () => {
    component.delta = null;
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).not.toContain('%');
  });

  it('should display delta label when provided', () => {
    component.delta = 8;
    component.deltaLabel = 'vs. mês anterior';
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('vs. mês anterior');
  });

  it('should display sub text when provided', () => {
    component.sub = 'Texto auxiliar';
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('Texto auxiliar');
  });
});
