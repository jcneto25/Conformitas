import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    const titleEl = fixture.debugElement.query(By.css('mat-card-title'));
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.textContent.trim()).toContain('Conformitas');
  });

  it('should display the subtitle', () => {
    const subEl = fixture.debugElement.query(By.css('mat-card-subtitle'));
    expect(subEl).toBeTruthy();
    expect(subEl.nativeElement.textContent.trim()).toContain('SGI — AUDIN/TJCE');
  });

  it('should have an email input field', () => {
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));
    expect(emailInput).toBeTruthy();
    expect(emailInput.attributes['autocomplete']).toBe('username');
  });

  it('should have a password input field', () => {
    const passInput = fixture.debugElement.query(By.css('input[type="password"]'));
    expect(passInput).toBeTruthy();
    expect(passInput.attributes['autocomplete']).toBe('current-password');
  });

  it('should have a submit button with "Entrar" text', () => {
    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitBtn).toBeTruthy();
    expect(submitBtn.nativeElement.textContent.trim()).toBe('Entrar');
  });

  it('should call auth.login with correct credentials on submit', () => {
    component.email = 'teste@mvp.local';
    component.senha = '123456';
    authSpy.login.and.resolveTo({ access_token: 'at', refresh_token: 'rt', expires_in: 1800 });
    component.onSubmit();
    expect(authSpy.login).toHaveBeenCalledWith('teste@mvp.local', '123456');
  });

  it('should navigate to / on successful login without MFA', async () => {
    component.email = 'teste@mvp.local';
    component.senha = '123456';
    authSpy.login.and.resolveTo({ access_token: 'at', refresh_token: 'rt', expires_in: 1800 });
    await component.onSubmit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to /mfa when MFA is required', async () => {
    component.email = 'teste@mvp.local';
    component.senha = '123456';
    authSpy.login.and.resolveTo({
      mfa_required: true,
      session_token: 'mock-session-token',
      access_token: '',
      refresh_token: '',
      expires_in: 0,
    });
    await component.onSubmit();
    expect(localStorage.getItem('session_token')).toBe('mock-session-token');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/mfa']);
  });

  it('should set error message on login failure', async () => {
    component.email = 'wrong@email.com';
    component.senha = 'wrong';
    authSpy.login.and.rejectWith({ error: { message: 'Credenciais inválidas' } });
    await component.onSubmit();
    expect(component.error).toBe('Credenciais inválidas');
  });

  it('should show generic error when no message is provided', async () => {
    component.email = 'wrong@email.com';
    component.senha = 'wrong';
    authSpy.login.and.rejectWith({});
    await component.onSubmit();
    expect(component.error).toBe('Erro ao autenticar');
  });

  it('should be disabled when loading', () => {
    component.loading = true;
    fixture.detectChanges();
    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitBtn.nativeElement.disabled).toBe(true);
  });

  it('should show spinner when loading', () => {
    component.loading = true;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should show error alert when error is set', () => {
    component.error = 'Credenciais inválidas';
    fixture.detectChanges();
    const alertEl = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(alertEl).toBeTruthy();
    expect(alertEl.nativeElement.textContent.trim()).toContain('Credenciais inválidas');
  });

  it('should not show error alert when error is empty', () => {
    component.error = '';
    fixture.detectChanges();
    const alertEl = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(alertEl).toBeNull();
  });

  it('should not call login when email is empty', () => {
    component.email = '';
    component.senha = '123456';
    component.onSubmit();
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('should not call login when password is empty', () => {
    component.email = 'teste@mvp.local';
    component.senha = '';
    component.onSubmit();
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('should not call login when already loading', () => {
    component.email = 'teste@mvp.local';
    component.senha = '123456';
    component.loading = true;
    component.onSubmit();
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('should reset loading state after failed login', async () => {
    component.email = 'teste@mvp.local';
    component.senha = '123456';
    authSpy.login.and.rejectWith({ error: { message: 'Erro' } });
    await component.onSubmit();
    expect(component.loading).toBeFalse();
  });
});