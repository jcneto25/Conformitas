import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EmptyStateComponent } from './empty-state.component';

@Component({
  standalone: true,
  imports: [EmptyStateComponent],
  template: '<app-empty-state><span class="projected">Extra content</span></app-empty-state>',
})
class TestHostComponent {}

describe('EmptyStateComponent', () => {
  let fixture: ComponentFixture<EmptyStateComponent>;
  let component: EmptyStateComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
  });

  it('should display default icon (search_off)', () => {
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon.nativeElement.textContent.trim()).toBe('search_off');
  });

  it('should display custom icon', () => {
    component.icon = 'error_outline';
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon.nativeElement.textContent.trim()).toBe('error_outline');
  });

  it('should not render icon when empty', () => {
    component.icon = '';
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon).toBeNull();
  });

  it('should display title', () => {
    component.title = 'Nenhum resultado';
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('Nenhum resultado');
  });

  it('should not render title when empty', () => {
    component.title = '';
    fixture.detectChanges();

    const h3 = fixture.debugElement.query(By.css('h3'));
    expect(h3).toBeNull();
  });

  it('should display description', () => {
    component.description = 'Tente ajustar os filtros de busca.';
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('Tente ajustar os filtros de busca.');
  });

  it('should display action button when actionLabel is provided', () => {
    component.actionLabel = 'Criar Novo';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button).not.toBeNull();
    expect(button.nativeElement.textContent).toContain('Criar Novo');
  });

  it('should emit action event on button click', () => {
    spyOn(component.action, 'emit');
    component.actionLabel = 'Criar Novo';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(component.action.emit).toHaveBeenCalled();
  });

  it('should not render action button when actionLabel is empty', () => {
    component.actionLabel = '';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeNull();
  });

  it('should apply small size class', () => {
    component.size = 'sm';
    fixture.detectChanges();

    const container = fixture.debugElement.nativeElement.querySelector('div');
    expect(container.classList).toContain('py-6');
  });

  it('should apply medium size class by default', () => {
    fixture.detectChanges();

    const container = fixture.debugElement.nativeElement.querySelector('div');
    expect(container.classList).toContain('py-10');
  });

  it('should apply large size class', () => {
    component.size = 'lg';
    fixture.detectChanges();

    const container = fixture.debugElement.nativeElement.querySelector('div');
    expect(container.classList).toContain('py-16');
  });

  it('should render projected content via ng-content', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const projected = hostFixture.debugElement.query(By.css('.projected'));
    expect(projected).not.toBeNull();
    expect(projected.nativeElement.textContent).toBe('Extra content');
  });
});
