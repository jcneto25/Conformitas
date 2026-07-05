import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../../core/services/auth.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        ValidationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render email and password fields', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    expect(inputs.length).toBe(2);
  });

  it('should render submit button with "Entrar" text', () => {
    const btn = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(btn.nativeElement.textContent.trim()).toContain('Entrar');
  });

  it('should not submit when form is invalid (empty)', async () => {
    component.email = '';
    component.senha = '';
    await component.onSubmit();
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('should call auth.login on submit', async () => {
    authSpy.login.and.returnValue(Promise.resolve({} as any));
    component.email = 'user@test.com';
    component.senha = 'password';
    fixture.detectChanges();

    await component.onSubmit();

    expect(authSpy.login).toHaveBeenCalledWith('user@test.com', 'password');
  });

  it('should navigate to / on successful login without MFA', async () => {
    authSpy.login.and.returnValue(Promise.resolve({ mfa_required: false } as any));
    component.email = 'user@test.com';
    component.senha = 'password';

    await component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to /mfa when MFA is required', async () => {
    authSpy.login.and.returnValue(
      Promise.resolve({ mfa_required: true, session_token: 'mock-session' } as any),
    );
    component.email = 'user@test.com';
    component.senha = 'password';

    await component.onSubmit();

    expect(localStorage.getItem('session_token')).toBe('mock-session');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/mfa']);
  });

  it('should show error message on login failure', async () => {
    authSpy.login.and.returnValue(
      Promise.reject({ error: { message: 'Credenciais inválidas' } }),
    );
    component.email = 'user@test.com';
    component.senha = 'wrong';
    fixture.detectChanges();

    await component.onSubmit();

    expect(component.error).toContain('Credenciais inválidas');
  });

  it('should show default error message on generic failure', async () => {
    authSpy.login.and.returnValue(Promise.reject(new Error('Network error')));
    component.email = 'user@test.com';
    component.senha = 'password';

    await component.onSubmit();

    expect(component.error).toBe('Erro ao autenticar');
  });

  it('should clear error before new login attempt', async () => {
    component.error = 'Old error';
    authSpy.login.and.returnValue(Promise.resolve({} as any));
    component.email = 'user@test.com';
    component.senha = 'password';

    await component.onSubmit();

    expect(component.error).toBe('');
  });

  it('should set loading to true during login', () => {
    authSpy.login.and.returnValue(
      new Promise(() => {}), // never resolves
    );
    component.email = 'user@test.com';
    component.senha = 'password';

    component.onSubmit();

    expect(component.loading).toBeTrue();
  });

  it('should show spinner when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).not.toBeNull();
    const btn = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(btn.nativeElement.textContent.trim()).toContain('Entrando...');
  });
});
