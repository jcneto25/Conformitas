import { TestBed } from '@angular/core/testing';
import { DensityService } from './density.service';

describe('DensityService', () => {
  let service: DensityService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [DensityService] });
    service = TestBed.inject(DensityService);
  });

  it('should default to comfortable (not compact)', () => {
    expect(service.isCompact()).toBeFalse();
    expect(service.className()).toBe('');
  });

  it('should toggle to compact mode', () => {
    service.toggle();
    expect(service.isCompact()).toBeTrue();
    expect(service.className()).toBe('app-compact');
  });

  it('should toggle back to comfortable', () => {
    service.toggle();
    service.toggle();
    expect(service.isCompact()).toBeFalse();
    expect(service.className()).toBe('');
  });

  it('should persist preference after toggle', async () => {
    service.toggle();
    await new Promise((r) => setTimeout(r, 0));
    expect(localStorage.getItem('conformitas_density')).toBe('compact');
  });

  it('should restore compact from localStorage', () => {
    localStorage.setItem('conformitas_density', 'compact');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [DensityService] });
    const svc = TestBed.inject(DensityService);
    expect(svc.isCompact()).toBeTrue();
  });

  it('should restore comfortable from localStorage when value is unknown', () => {
    localStorage.setItem('conformitas_density', 'other');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [DensityService] });
    const svc = TestBed.inject(DensityService);
    expect(svc.isCompact()).toBeFalse();
  });
});
