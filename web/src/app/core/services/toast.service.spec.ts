import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ToastService] });
    service = TestBed.inject(ToastService);
  });

  it('should start with empty toasts', () => {
    expect(service.toasts()).toEqual([]);
  });

  it('should add a toast with unique id', () => {
    service.show('Mensagem de erro', 'error');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Mensagem de erro');
    expect(service.toasts()[0].type).toBe('error');
    expect(service.toasts()[0].id).toBeGreaterThan(0);
  });

  it('should increment id for each new toast', () => {
    service.show('Toast 1', 'info');
    service.show('Toast 2', 'info');
    const ids = service.toasts().map((t) => t.id);
    expect(ids[1]).toBeGreaterThan(ids[0]);
  });

  it('should default type to error', () => {
    service.show('Sem tipo');
    expect(service.toasts()[0].type).toBe('error');
  });

  it('should support all toast types', () => {
    const types: Array<'success' | 'error' | 'warning' | 'info'> = [
      'success', 'error', 'warning', 'info',
    ];
    for (const type of types) {
      service.show(`Toast ${type}`, type);
    }
    // Max 3 toasts, so the first one gets evicted
    expect(service.toasts().length).toBe(3);
    expect(service.toasts().map((t) => t.type)).toEqual(['error', 'warning', 'info']);
  });

  it('should dismiss a toast by id', () => {
    service.show('Toast 1', 'info');
    service.show('Toast 2', 'info');
    const idToRemove = service.toasts()[0].id;

    service.dismiss(idToRemove);

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].id).not.toBe(idToRemove);
  });

  it('should keep max 3 toasts', () => {
    service.show('1', 'info');
    service.show('2', 'info');
    service.show('3', 'info');
    service.show('4', 'info');

    expect(service.toasts().length).toBe(3);
    expect(service.toasts().map((t) => t.message)).toEqual(['2', '3', '4']);
  });

  it('should auto-dismiss after duration', fakeAsync(() => {
    service.show('Auto dismiss', 'info');
    expect(service.toasts().length).toBe(1);

    tick(5001);
    expect(service.toasts().length).toBe(0);
  }));

  it('should set timestamp on toast', () => {
    const before = Date.now();
    service.show('Com timestamp', 'info');
    const after = Date.now();

    const timestamp = service.toasts()[0].timestamp;
    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });
});
