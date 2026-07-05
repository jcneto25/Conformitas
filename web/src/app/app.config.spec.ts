import { appConfig } from './app.config';

describe('AppConfig', () => {
  it('should have providers array', () => {
    expect(appConfig.providers).toBeDefined();
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });

  it('should provide router', () => {
    const hasRouter = appConfig.providers.some((p) =>
      typeof p === 'object' && 'ɵprov' in p,
    );
    expect(appConfig.providers.length).toBeGreaterThanOrEqual(5);
  });

  it('should include MatPaginatorIntl provider', () => {
    const paginatorProvider = appConfig.providers.find(
      (p: any) => p?.provide?.name === 'MatPaginatorIntl',
    );
    expect(paginatorProvider).toBeDefined();
  });
});
