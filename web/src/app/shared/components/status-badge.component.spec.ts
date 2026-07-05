import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let fixture: ComponentFixture<StatusBadgeComponent>;
  let component: StatusBadgeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should display status text', () => {
    component.status = 'APROVADO';
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent.trim()).toBe('APROVADO');
  });

  it('should prefer label over status text', () => {
    component.status = 'APROVADO';
    component.label = 'Aprovado pelo Presidente';
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent.trim()).toBe('Aprovado pelo Presidente');
  });

  it('should apply success style for APROVADO', () => {
    component.status = 'APROVADO';
    fixture.detectChanges();

    const span = fixture.debugElement.nativeElement.querySelector('span');
    expect(span.classList).toContain('bg-success-bg');
    expect(span.classList).toContain('text-success');
  });

  it('should apply info style for EM_EXECUCAO', () => {
    component.status = 'EM_EXECUCAO';
    fixture.detectChanges();

    const span = fixture.debugElement.nativeElement.querySelector('span');
    expect(span.classList).toContain('bg-info-bg');
    expect(span.classList).toContain('text-info');
  });

  it('should apply warning style for PENDENTE', () => {
    component.status = 'PENDENTE';
    fixture.detectChanges();

    const span = fixture.debugElement.nativeElement.querySelector('span');
    expect(span.classList).toContain('bg-warning-bg');
    expect(span.classList).toContain('text-warning');
  });

  it('should apply critical style for VENCIDA', () => {
    component.status = 'VENCIDA';
    fixture.detectChanges();

    const span = fixture.debugElement.nativeElement.querySelector('span');
    expect(span.classList).toContain('bg-critical-bg');
    expect(span.classList).toContain('text-critical');
  });

  it('should fallback to INATIVO style for unknown status', () => {
    component.status = 'UNKNOWN_STATUS';
    fixture.detectChanges();

    const span = fixture.debugElement.nativeElement.querySelector('span');
    expect(span.classList).toContain('text-text-sec');
  });

  it('should be case-insensitive', () => {
    component.status = 'aprovado';
    fixture.detectChanges();

    const span = fixture.debugElement.nativeElement.querySelector('span');
    expect(span.classList).toContain('bg-success-bg');
  });

  it('should handle CUSTOM LABEL for ATIVO status', () => {
    component.status = 'ATIVO';
    fixture.detectChanges();

    const span = fixture.debugElement.nativeElement.querySelector('span');
    expect(span.classList).toContain('bg-success-bg');
    expect(span.textContent?.trim()).toBe('ATIVO');
  });
});
