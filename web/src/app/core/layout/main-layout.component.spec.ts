import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../services/auth.service';
import { MainLayoutComponent } from './main-layout.component';

@Component({ standalone: true, template: '<p>dummy</p>' })
class DummyComponent {}

describe('MainLayoutComponent', () => {
  let fixture: ComponentFixture<MainLayoutComponent>;
  let authServiceStub: any;

  function createAuthService(roles: string[], userName = 'Test User') {
    const rolesSignal = signal(roles);
    const authStub: any = {
      user: signal({ nome: userName, cargo: 'Auditor', email: 'test@test.com', matricula: '123', unidade: 'AUDIN', ativo: true, mfaEnabled: false, usuariosPerfis: [], id: '1' }),
      userRoles: rolesSignal,
      isAuthenticated: signal(true),
      hasAnyRole: (allowedRoles: string[]) => allowedRoles.some((r) => rolesSignal().includes(r)),
      logout: jasmine.createSpy('logout'),
      ready: Promise.resolve(),
    };
    return authStub;
  }

  beforeEach(async () => {
    authServiceStub = createAuthService(['P01']);

    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        provideHttpClient(),
        provideRouter([{ path: '**', component: DummyComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render brand header', () => {
    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('CONFORMITAS');
    expect(el.textContent).toContain('3.0 SGI');
  });

  it('should render user name in toolbar', () => {
    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('Test User');
  });

  it('should render density toggle', () => {
    const toggle = fixture.debugElement.query(By.css('mat-slide-toggle'));
    expect(toggle).not.toBeNull();
  });

  it('should filter nav items by role', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('a[mat-list-item]'));
    const labels = navLinks.map((a) => a.nativeElement.textContent.trim());
    // P01 should see dashboard
    expect(labels.some((l) => l.includes('Dashboard'))).toBeTrue();
    // P01 should NOT see Usuários (P10 only)
    expect(labels.some((l) => l.includes('Usuários'))).toBeFalse();
  });

  it('should show P10-only nav items when user is P10', () => {
    authServiceStub.userRoles.set(['P10']);
    fixture.detectChanges();

    const navLinks = fixture.debugElement.queryAll(By.css('a[mat-list-item]'));
    const labels = navLinks.map((a) => a.nativeElement.textContent.trim());
    expect(labels.some((l) => l.includes('Usuários'))).toBeTrue();
    expect(labels.some((l) => l.includes('Perfis'))).toBeTrue();
    expect(labels.some((l) => l.includes('Configurações'))).toBeTrue();
  });

  it('should render breadcrumb nav', () => {
    const nav = fixture.debugElement.query(By.css('nav[aria-label="Trilha de navegação"]'));
    expect(nav).not.toBeNull();
  });
});
