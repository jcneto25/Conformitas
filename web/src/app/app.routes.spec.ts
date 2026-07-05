import { routes } from './app.routes';

describe('AppRoutes', () => {
  it('should have routes defined', () => {
    expect(routes).toBeDefined();
    expect(routes.length).toBeGreaterThan(0);
  });

  it('should have root path redirecting to MainLayoutComponent with authGuard', () => {
    const rootRoute = routes.find((r) => r.path === '');
    expect(rootRoute).toBeDefined();
    expect(rootRoute!.canActivate).toBeDefined();
    expect(rootRoute!.children).toBeDefined();
    expect(rootRoute!.children!.length).toBeGreaterThan(0);
  });

  it('should have dashboard as default child route', () => {
    const rootRoute = routes.find((r) => r.path === '');
    const redirectRoute = rootRoute!.children!.find((r) => r.path === '');
    expect(redirectRoute).toBeDefined();
    expect(redirectRoute!.redirectTo).toBe('dashboard');
  });

  it('should have dashboard child routes', () => {
    const rootRoute = routes.find((r) => r.path === '');
    const dashRoute = rootRoute!.children!.find((r) => r.path === 'dashboard');
    expect(dashRoute).toBeDefined();
    expect(dashRoute!.loadComponent).toBeDefined();
  });

  it('should have login route at root level', () => {
    const loginRoute = routes.find((r) => r.path === 'login');
    expect(loginRoute).toBeDefined();
    expect(loginRoute!.loadComponent).toBeDefined();
  });

  it('should have catch-all redirect to login', () => {
    const catchAll = routes.find((r) => r.path === '**');
    expect(catchAll).toBeDefined();
    expect(catchAll!.redirectTo).toBe('/login');
  });
});
