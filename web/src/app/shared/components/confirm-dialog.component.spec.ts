import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  const defaultData: ConfirmDialogData = {
    title: 'Confirmar exclusão',
    message: 'Tem certeza que deseja excluir este item?',
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { ...defaultData } },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title from data', () => {
    const titleEl = fixture.debugElement.query(By.css('[mat-dialog-title]'));
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.textContent.trim()).toBe('Confirmar exclusão');
  });

  it('should display the message from data', () => {
    const contentEl = fixture.debugElement.query(By.css('mat-dialog-content'));
    expect(contentEl).toBeTruthy();
    expect(contentEl.nativeElement.textContent.trim()).toBe('Tem certeza que deseja excluir este item?');
  });

  it('should display default cancel button text', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(2);
    const cancelBtn = buttons[0];
    expect(cancelBtn.nativeElement.textContent.trim()).toBe('Cancelar');
  });

  it('should display default confirm button text', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const confirmBtn = buttons[1];
    expect(confirmBtn.nativeElement.textContent.trim()).toBe('Confirmar');
  });

  it('should use custom button texts when provided', () => {
    TestBed.resetTestingModule();
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Sair sem salvar?',
            message: 'Você tem alterações não salvas.',
            confirmText: 'Descartar e sair',
            cancelText: 'Continuar editando',
          } as ConfirmDialogData,
        },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons[0].nativeElement.textContent.trim()).toBe('Continuar editando');
    expect(buttons[1].nativeElement.textContent.trim()).toBe('Descartar e sair');
  });

  it('should use warn color when type is danger', () => {
    TestBed.resetTestingModule();
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { ...defaultData, type: 'danger' } as ConfirmDialogData,
        },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const confirmBtn = fixture.debugElement.queryAll(By.css('button'))[1];
    expect(confirmBtn.attributes['ng-reflect-color']).toBe('warn');
  });

  it('should use primary color when type is warning or info', () => {
    TestBed.resetTestingModule();
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { ...defaultData, type: 'warning' } as ConfirmDialogData,
        },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const confirmBtn = fixture.debugElement.queryAll(By.css('button'))[1];
    expect(confirmBtn.attributes['ng-reflect-color']).toBe('primary');
  });

  it('should close dialog via ref when cancel is clicked', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons[0].attributes['mat-dialog-close']).toBeDefined();
  });

  it('should have both cancel and confirm buttons enabled', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(2);
    // Both buttons should not be disabled
    expect(buttons[0].nativeElement.disabled).toBeFalse();
    expect(buttons[1].nativeElement.disabled).toBeFalse();
  });
});