import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard, rolesGuard } from './auth.guard';

const mockRoute = {} as ActivatedRouteSnapshot;
const mockState = {} as RouterStateSnapshot;

describe('authGuard', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['isAuthenticated'],
      { ready: Promise.resolve() },
    );
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow when authenticated', async () => {
    authSpy.isAuthenticated.and.returnValue(true);

    const result = await TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState),
    );

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /login when not authenticated', async () => {
    authSpy.isAuthenticated.and.returnValue(false);

    const result = await TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState),
    );

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should await ready before checking authentication', async () => {
    let readyResolved = false;
    authSpy = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['isAuthenticated'],
      {
        ready: new Promise<void>((resolve) => {
          setTimeout(() => {
            readyResolved = true;
            resolve();
          }, 10);
        }),
      },
    );
    authSpy.isAuthenticated.and.returnValue(true);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    const result = await TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState),
    );

    expect(readyResolved).toBeTrue();
    expect(result).toBeTrue();
  });
});

describe('rolesGuard', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['isAuthenticated', 'hasAnyRole'],
      { ready: Promise.resolve() },
    );
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow when authenticated and has required role', async () => {
    authSpy.isAuthenticated.and.returnValue(true);
    authSpy.hasAnyRole.and.returnValue(true);

    const guard = rolesGuard(['P10']);
    const result = await TestBed.runInInjectionContext(() =>
      guard(mockRoute, mockState),
    );

    expect(result).toBeTrue();
    expect(authSpy.hasAnyRole).toHaveBeenCalledWith(['P10']);
  });

  it('should redirect to / when authenticated but lacks role', async () => {
    authSpy.isAuthenticated.and.returnValue(true);
    authSpy.hasAnyRole.and.returnValue(false);

    const guard = rolesGuard(['P10']);
    const result = await TestBed.runInInjectionContext(() =>
      guard(mockRoute, mockState),
    );

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should redirect to /login when not authenticated', async () => {
    authSpy.isAuthenticated.and.returnValue(false);

    const guard = rolesGuard(['P10']);
    const result = await TestBed.runInInjectionContext(() =>
      guard(mockRoute, mockState),
    );

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should await ready before checking roles', async () => {
    authSpy.isAuthenticated.and.returnValue(true);
    authSpy.hasAnyRole.and.returnValue(true);

    const guard = rolesGuard(['P10']);
    const result = await TestBed.runInInjectionContext(() =>
      guard(mockRoute, mockState),
    );

    expect(result).toBeTrue();
  });
});
