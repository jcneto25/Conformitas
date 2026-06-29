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
    authSpy = jasmine.createSpyObj('AuthService', ['loadProfile'], {
      isAuthenticated: jasmine.createSpy(),
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow when authenticated', () => {
    (authSpy.isAuthenticated as jasmine.Spy).and.returnValue(true);
    TestBed.runInInjectionContext(() => {
      expect(authGuard(mockRoute, mockState)).toBeTrue();
    });
  });

  it('should allow when token exists but not yet loaded', () => {
    (authSpy.isAuthenticated as jasmine.Spy).and.returnValue(false);
    localStorage.setItem('access_token', 'some-token');
    TestBed.runInInjectionContext(() => {
      expect(authGuard(mockRoute, mockState)).toBeTrue();
    });
    expect(authSpy.loadProfile).toHaveBeenCalled();
  });

  it('should redirect to login when not authenticated and no token', () => {
    (authSpy.isAuthenticated as jasmine.Spy).and.returnValue(false);
    TestBed.runInInjectionContext(() => {
      expect(authGuard(mockRoute, mockState)).toBeFalse();
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});

describe('rolesGuard', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['hasAnyRole'], {
      isAuthenticated: jasmine.createSpy(),
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow when authenticated and has required role', () => {
    (authSpy.isAuthenticated as jasmine.Spy).and.returnValue(true);
    (authSpy.hasAnyRole as jasmine.Spy).and.returnValue(true);

    const guard = rolesGuard(['P10']);
    TestBed.runInInjectionContext(() => {
      expect(guard(mockRoute, mockState)).toBeTrue();
    });
    expect(authSpy.hasAnyRole).toHaveBeenCalledWith(['P10']);
  });

  it('should redirect to / when authenticated but lacks role', () => {
    (authSpy.isAuthenticated as jasmine.Spy).and.returnValue(true);
    (authSpy.hasAnyRole as jasmine.Spy).and.returnValue(false);

    const guard = rolesGuard(['P10']);
    TestBed.runInInjectionContext(() => {
      expect(guard(mockRoute, mockState)).toBeFalse();
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should redirect to login when not authenticated', () => {
    (authSpy.isAuthenticated as jasmine.Spy).and.returnValue(false);

    const guard = rolesGuard(['P10']);
    TestBed.runInInjectionContext(() => {
      expect(guard(mockRoute, mockState)).toBeFalse();
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
