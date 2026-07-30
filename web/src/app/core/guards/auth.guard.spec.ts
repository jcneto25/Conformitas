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
      // The guard awaits auth.ready — provide a resolved promise so it doesn't hang.
      ready: Promise.resolve(),
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

  it('should allow when authenticated', async () => {
    (authSpy.isAuthenticated as jasmine.Spy).and.returnValue(true);
    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
    await expectAsync(result).toBeResolvedTo(true);
  });

  it('should allow when token exists (ready populates isAuthenticated)', async () => {
    // Simulate auth service behavior: when a token exists, ready resolves and isAuthenticated becomes true.
    (authSpy.isAuthenticated as jasmine.Spy).and.returnValue(true);
    localStorage.setItem('access_token', 'some-token');
    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
    await expectAsync(result).toBeResolvedTo(true);
  });

  it('should redirect to login when not authenticated and no token', async () => {
    (authSpy.isAuthenticated as jasmine.Spy).and.returnValue(false);
    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
    await expectAsync(result).toBeResolvedTo(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});

describe('rolesGuard', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['hasAnyRole'], {
      isAuthenticated: jasmine.createSpy(),
      ready: Promise.resolve(),
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow when authenticated and has required role', async () => {
    (authSpy.isAuthenticated as jasmine.Spy).and.returnValue(true);
    (authSpy.hasAnyRole as jasmine.Spy).and.returnValue(true);

    const guard = rolesGuard(['P10']);
    const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
    await expectAsync(result).toBeResolvedTo(true);
    expect(authSpy.hasAnyRole).toHaveBeenCalledWith(['P10']);
  });

  it('should redirect to / when authenticated but lacks role', async () => {
    (authSpy.isAuthenticated as jasmine.Spy).and.returnValue(true);
    (authSpy.hasAnyRole as jasmine.Spy).and.returnValue(false);

    const guard = rolesGuard(['P10']);
    const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
    await expectAsync(result).toBeResolvedTo(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should redirect to login when not authenticated', async () => {
    (authSpy.isAuthenticated as jasmine.Spy).and.returnValue(false);

    const guard = rolesGuard(['P10']);
    const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
    await expectAsync(result).toBeResolvedTo(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});