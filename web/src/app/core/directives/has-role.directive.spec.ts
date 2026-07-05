import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { HasRoleDirective } from './has-role.directive';

@Component({
  standalone: true,
  imports: [HasRoleDirective],
  template: `
    <div *appHasRole="requiredRoles">Conteúdo restrito</div>
  `,
})
class TestHostComponent {
  requiredRoles: string | string[] = ['P01'];
}

describe('HasRoleDirective', () => {
  let authRoles: string[] = [];

  function createAuthService(roles: string[]): AuthService {
    const rolesSignal = signal(roles);
    return {
      userRoles: jasmine.createSpy().and.callFake(() => rolesSignal()),
      hasRole: jasmine.createSpy(),
      hasAnyRole: jasmine.createSpy(),
      isAuthenticated: signal(false),
      user: signal(null),
      ready: Promise.resolve(),
    } as unknown as AuthService;
  }

  beforeEach(() => {
    authRoles = [];
  });

  it('should show content when user has the required role', () => {
    authRoles = ['P01'];
    const auth = createAuthService(authRoles);

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.requiredRoles = ['P01'];
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('div'));
    expect(element).not.toBeNull();
    expect(element.nativeElement.textContent).toContain('Conteúdo restrito');
  });

  it('should hide content when user lacks the required role', () => {
    authRoles = ['P05'];
    const auth = createAuthService(authRoles);

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.requiredRoles = ['P01'];
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('div'));
    expect(element).toBeNull();
  });

  it('should support single role string input', () => {
    authRoles = ['P10'];
    const auth = createAuthService(authRoles);

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.requiredRoles = 'P10';
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('div'));
    expect(element).not.toBeNull();
  });

  it('should show when user has at least one of multiple roles', () => {
    authRoles = ['P02', 'P05'];
    const auth = createAuthService(authRoles);

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.requiredRoles = ['P01', 'P02'];
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('div'));
    expect(element).not.toBeNull();
  });

  it('should hide when user has none of the multiple roles', () => {
    authRoles = ['P05', 'P06'];
    const auth = createAuthService(authRoles);

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.requiredRoles = ['P01', 'P02'];
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('div'));
    expect(element).toBeNull();
  });
});
