import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToastService } from '../../core/services/toast.service';
import { ToastContainerComponent } from './toast-container.component';

describe('ToastContainerComponent', () => {
  let fixture: ComponentFixture<ToastContainerComponent>;
  let component: ToastContainerComponent;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
      providers: [ToastService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should render no toasts initially', () => {
    const toasts = fixture.debugElement.queryAll(By.css('[role="alert"]'));
    expect(toasts.length).toBe(0);
  });

  it('should render toasts from service', () => {
    toastService.show('Erro no servidor', 'error');
    fixture.detectChanges();

    const toasts = fixture.debugElement.queryAll(By.css('[role="alert"]'));
    expect(toasts.length).toBe(1);
  });

  it('should display toast message', () => {
    toastService.show('Mensagem de teste', 'info');
    fixture.detectChanges();

    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('Mensagem de teste');
  });

  it('should apply error style for error type', () => {
    toastService.show('Erro', 'error');
    fixture.detectChanges();

    const toast = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(toast.classes['bg-critical']).toBeTrue();
  });

  it('should apply warning style for warning type', () => {
    toastService.show('Aviso', 'warning');
    fixture.detectChanges();

    const toast = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(toast.classes['bg-warning']).toBeTrue();
  });

  it('should apply info style for info type', () => {
    toastService.show('Info', 'info');
    fixture.detectChanges();

    const toast = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(toast.classes['bg-info']).toBeTrue();
  });

  it('should apply success style for success type', () => {
    toastService.show('Sucesso', 'success');
    fixture.detectChanges();

    const toast = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(toast.classes['bg-success']).toBeTrue();
  });

  it('should dismiss toast on close button click', () => {
    toastService.show('Mensagem', 'info');
    fixture.detectChanges();

    const closeBtn = fixture.debugElement.query(By.css('button'));
    closeBtn.nativeElement.click();
    fixture.detectChanges();

    const toasts = fixture.debugElement.queryAll(By.css('[role="alert"]'));
    expect(toasts.length).toBe(0);
  });

  it('should render correct icon for each type', () => {
    expect(component.iconFor('error')).toBe('error');
    expect(component.iconFor('warning')).toBe('warning');
    expect(component.iconFor('info')).toBe('info');
    expect(component.iconFor('success')).toBe('check_circle');
    expect(component.iconFor('unknown')).toBe('info');
  });
});
