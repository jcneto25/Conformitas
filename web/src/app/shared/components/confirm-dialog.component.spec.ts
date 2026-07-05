import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  const defaultData: ConfirmDialogData = {
    title: 'Confirmação',
    message: 'Tem certeza?',
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: defaultData },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display title from data', () => {
    const title = fixture.debugElement.query(By.css('[mat-dialog-title]'));
    expect(title.nativeElement.textContent).toContain('Confirmação');
  });

  it('should display message from data', () => {
    const content = fixture.debugElement.query(By.css('mat-dialog-content'));
    expect(content.nativeElement.textContent).toContain('Tem certeza?');
  });

  it('should show default cancel text when not provided', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const cancelBtn = buttons.find((b) => b.nativeElement.textContent.includes('Cancelar'));
    expect(cancelBtn).not.toBeUndefined();
  });

  it('should show default confirm text when not provided', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const confirmBtn = buttons.find((b) => b.nativeElement.textContent.includes('Confirmar'));
    expect(confirmBtn).not.toBeUndefined();
  });

  it('should use custom confirm and cancel texts', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, MatDialogModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Excluir',
            message: 'Esta ação é irreversível.',
            confirmText: 'Sim, excluir',
            cancelText: 'Voltar',
          },
        },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    const fix = TestBed.createComponent(ConfirmDialogComponent);
    fix.detectChanges();

    const buttons = fix.debugElement.queryAll(By.css('button'));
    const texts = buttons.map((b) => b.nativeElement.textContent.trim());
    expect(texts).toContain('Sim, excluir');
    expect(texts).toContain('Voltar');
  });

  it('should use warn color for danger type', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, MatDialogModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { title: 'Atenção', message: 'Cuidado!', type: 'danger' },
        },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    const fix = TestBed.createComponent(ConfirmDialogComponent);
    fix.detectChanges();

    const confirmBtn = fix.debugElement.queryAll(By.css('button'))[1];
    expect(confirmBtn.attributes['ng-reflect-color']).toBe('warn');
  });

  it('should use primary color for non-danger types', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, MatDialogModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { title: 'Info', message: 'Aviso', type: 'info' },
        },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    const fix = TestBed.createComponent(ConfirmDialogComponent);
    fix.detectChanges();

    const confirmBtn = fix.debugElement.queryAll(By.css('button'))[1];
    expect(confirmBtn.attributes['ng-reflect-color']).toBe('primary');
  });
});
