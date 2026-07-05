import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../core/services/auth.service';
import { ValidationService } from '../../shared/services/validation.service';
import { MfaComponent } from './mfa.component';

describe('MfaComponent', () => {
  let fixture: ComponentFixture<MfaComponent>;
  let component: MfaComponent;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['verifyMfa']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [
        MfaComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        ValidationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render TOTP input field', () => {
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).not.toBeNull();
  });

  it('should render verify button', () => {
    const btn = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(btn.nativeElement.textContent.trim()).toContain('Verificar');
  });

  it('should not submit when TOTP is empty', async () => {
    component.totp = '';
    await component.onSubmit();
    // Should not call verifyMfa because totp is empty
    expect(authSpy.verifyMfa).not.toHaveBeenCalled();
  });

  it('should show session expired error when no session token', async () => {
    component.totp = '123456';

    await component.onSubmit();

    expect(component.error).toBe('Sessão expirada. Faça login novamente.');
    expect(component.loading).toBeFalse();
  });

  it('should call auth.verifyMfa and navigate on success', async () => {
    localStorage.setItem('session_token', 'mock-session');
    authSpy.verifyMfa.and.returnValue(Promise.resolve());
    component.totp = '123456';

    await component.onSubmit();

    expect(authSpy.verifyMfa).toHaveBeenCalledWith('mock-session', '123456');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show error on invalid TOTP', async () => {
    localStorage.setItem('session_token', 'mock-session');
    authSpy.verifyMfa.and.returnValue(
      Promise.reject({ error: { message: 'Código TOTP inválido' } }),
    );
    component.totp = '000000';

    await component.onSubmit();

    expect(component.error).toBe('Código TOTP inválido');
  });

  it('should show default error on generic MFA failure', async () => {
    localStorage.setItem('session_token', 'mock-session');
    authSpy.verifyMfa.and.returnValue(Promise.reject(new Error('Unknown')));
    component.totp = '123456';

    await component.onSubmit();

    expect(component.error).toBe('Código TOTP inválido');
  });

  it('should set loading to true during verification', () => {
    localStorage.setItem('session_token', 'mock-session');
    authSpy.verifyMfa.and.returnValue(new Promise(() => {}));
    component.totp = '123456';

    component.onSubmit();

    expect(component.loading).toBeTrue();
  });

  it('should show spinner when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).not.toBeNull();
    const btn = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(btn.nativeElement.textContent.trim()).toContain('Verificando...');
  });
});
