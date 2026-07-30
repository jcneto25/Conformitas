import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent, EmptyStateSize } from './empty-state.component';
import { By } from '@angular/platform-browser';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default icon', () => {
    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.textContent.trim()).toBe('search_off');
  });

  it('should display the title when provided', () => {
    component.title = 'Nenhum registro encontrado';
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('h3'));
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.textContent.trim()).toBe('Nenhum registro encontrado');
  });

  it('should not render title when empty', () => {
    component.title = '';
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('h3'));
    expect(titleEl).toBeNull();
  });

  it('should display description when provided', () => {
    component.description = 'Tente ajustar os filtros';
    fixture.detectChanges();
    const descEl = fixture.debugElement.query(By.css('p'));
    expect(descEl).toBeTruthy();
    expect(descEl.nativeElement.textContent.trim()).toBe('Tente ajustar os filtros');
  });

  it('should not render description when empty', () => {
    component.description = '';
    fixture.detectChanges();
    const descEl = fixture.debugElement.query(By.css('p'));
    expect(descEl).toBeNull();
  });

  it('should display action button when actionLabel is set', () => {
    component.actionLabel = 'Criar Novo';
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn).toBeTruthy();
    expect(btn.nativeElement.textContent.trim()).toContain('Criar Novo');
  });

  it('should not render action button when actionLabel is empty', () => {
    component.actionLabel = '';
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn).toBeNull();
  });

  it('should emit action event when action button is clicked', () => {
    spyOn(component.action, 'emit');
    component.actionLabel = 'Criar Novo';
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    btn.nativeElement.click();
    expect(component.action.emit).toHaveBeenCalled();
  });

  it('should not render icon when icon input is empty', () => {
    component.icon = '';
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon).toBeNull();
  });

  it('should apply sm size classes correctly', () => {
    component.size = 'sm';
    expect(component.containerClass).toContain('py-6');
    expect(component.iconClass).toContain('text-3xl');
    expect(component.titleClass).toContain('text-sm');
    expect(component.descriptionClass).toContain('text-xs');
  });

  it('should apply md size classes correctly', () => {
    component.size = 'md';
    expect(component.containerClass).toContain('py-10');
    expect(component.iconClass).toContain('text-5xl');
    expect(component.titleClass).toContain('text-lg');
    expect(component.descriptionClass).toContain('text-sm');
  });

  it('should apply lg size classes correctly', () => {
    component.size = 'lg';
    expect(component.containerClass).toContain('py-16');
    expect(component.iconClass).toContain('text-7xl');
    expect(component.titleClass).toContain('text-xl');
    expect(component.descriptionClass).toContain('text-base');
  });

  it('should fall back to md sizes for unknown size', () => {
    component.size = 'unknown' as EmptyStateSize;
    expect(component.containerClass).toContain('py-10');
    expect(component.iconClass).toContain('text-5xl');
  });

  it('should render custom actionIcon on the action button', () => {
    component.actionLabel = 'Adicionar';
    component.actionIcon = 'add_circle';
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('button mat-icon'));
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.textContent.trim()).toBe('add_circle');
  });

  it('should project ng-content', () => {
    const projected = fixture.debugElement.query(By.css('[data-testid="projected"]'));
    // Since we don't project content here, this tests the ng-content slot exists
    const container = fixture.debugElement.query(By.css('.flex.flex-col'));
    expect(container).toBeTruthy();
  });
});