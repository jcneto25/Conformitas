import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';
import { By } from '@angular/platform-browser';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the status text as badge label when label is not set', () => {
    component.status = 'APROVADO';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.nativeElement.textContent.trim()).toBe('APROVADO');
  });

  it('should display the label text when provided', () => {
    component.status = 'APROVADO';
    component.label = 'Aprovado';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.nativeElement.textContent.trim()).toBe('Aprovado');
  });

  it('should apply success style for APROVADO status', () => {
    component.status = 'APROVADO';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.classes['bg-success-bg']).toBeTrue();
    expect(badgeEl.classes['text-success']).toBeTrue();
  });

  it('should apply success style for PUBLICADO status', () => {
    component.status = 'PUBLICADO';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.classes['bg-success-bg']).toBeTrue();
    expect(badgeEl.classes['text-success']).toBeTrue();
  });

  it('should apply success style for CUMPRIDA status', () => {
    component.status = 'CUMPRIDA';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.classes['bg-success-bg']).toBeTrue();
    expect(badgeEl.classes['text-success']).toBeTrue();
  });

  it('should apply success style for ATIVO status', () => {
    component.status = 'ATIVO';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.classes['bg-success-bg']).toBeTrue();
    expect(badgeEl.classes['text-success']).toBeTrue();
  });

  it('should apply info style for RASCUNHO status', () => {
    component.status = 'RASCUNHO';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.classes['bg-info-bg']).toBeTrue();
    expect(badgeEl.classes['text-info']).toBeTrue();
  });

  it('should apply info style for EM_EXECUCAO status', () => {
    component.status = 'EM_EXECUCAO';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.classes['bg-info-bg']).toBeTrue();
    expect(badgeEl.classes['text-info']).toBeTrue();
  });

  it('should apply warning style for SUBMETIDO status', () => {
    component.status = 'SUBMETIDO';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.classes['bg-warning-bg']).toBeTrue();
    expect(badgeEl.classes['text-warning']).toBeTrue();
  });

  it('should apply warning style for PENDENTE status', () => {
    component.status = 'PENDENTE';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.classes['bg-warning-bg']).toBeTrue();
    expect(badgeEl.classes['text-warning']).toBeTrue();
  });

  it('should apply critical style for VENCIDA status', () => {
    component.status = 'VENCIDA';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.classes['bg-critical-bg']).toBeTrue();
    expect(badgeEl.classes['text-critical']).toBeTrue();
  });

  it('should apply critical style for SUSPENSA status', () => {
    component.status = 'SUSPENSA';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.classes['bg-critical-bg']).toBeTrue();
    expect(badgeEl.classes['text-critical']).toBeTrue();
  });

  it('should default to inactive style for unknown status', () => {
    component.status = 'UNKNOWN_STATUS';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.classes['bg-background']).toBeTrue();
    expect(badgeEl.classes['text-text-sec']).toBeTrue();
  });

  it('should be case-insensitive when matching status', () => {
    component.status = 'aprovado';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.classes['bg-success-bg']).toBeTrue();
    expect(badgeEl.classes['text-success']).toBeTrue();
  });

  it('should apply rounded-full and font-medium classes', () => {
    component.status = 'APROVADO';
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('span'));
    expect(badgeEl.classes['rounded-full']).toBeTrue();
    expect(badgeEl.classes['font-medium']).toBeTrue();
  });
});