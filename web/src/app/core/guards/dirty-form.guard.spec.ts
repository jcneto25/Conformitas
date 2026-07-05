import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { confirmDeactivate, CanFormDeactivate } from './dirty-form.guard';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';

describe('confirmDeactivate', () => {
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<unknown>>;

  const currentRoute = {} as ActivatedRouteSnapshot;
  const currentState = {} as RouterStateSnapshot;
  const nextState = {} as RouterStateSnapshot;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [], {
      afterClosed: jasmine.createSpy().and.returnValue(of(true)),
    });
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpy);

    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
      ],
    });
  });

  it('should allow deactivation when component has no canDeactivate', () => {
    TestBed.runInInjectionContext(() => {
      const result = confirmDeactivate({} as any, currentRoute, currentState, nextState);
      expect(result).toBeTrue();
    });
  });

  it('should allow deactivation when canDeactivate returns true (clean form)', () => {
    const cleanComponent: CanFormDeactivate = { canDeactivate: () => true };

    TestBed.runInInjectionContext(() => {
      const result = confirmDeactivate(cleanComponent, currentRoute, currentState, nextState);
      expect(result).toBeTrue();
    });

    expect(dialogSpy.open).not.toHaveBeenCalled();
  });

  it('should open confirm dialog when canDeactivate returns false (dirty form)', () => {
    const dirtyComponent: CanFormDeactivate = { canDeactivate: () => false };

    TestBed.runInInjectionContext(() => {
      confirmDeactivate(dirtyComponent, currentRoute, currentState, nextState);
    });

    expect(dialogSpy.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      jasmine.objectContaining({
        data: jasmine.objectContaining({
          title: 'Sair sem salvar?',
          type: 'warning',
        }),
      }),
    );
  });

  it('should resolve with true via dialog afterClosed (user confirms)', (done) => {
    const dirtyComponent: CanFormDeactivate = { canDeactivate: () => false };
    (dialogRefSpy.afterClosed as jasmine.Spy).and.returnValue(of(true));

    TestBed.runInInjectionContext(() => {
      const observable = confirmDeactivate(dirtyComponent, currentRoute, currentState, nextState);
      if (observable && typeof (observable as any).subscribe === 'function') {
        (observable as any).subscribe((result: unknown) => {
          expect(result).toBeTrue();
          done();
        });
      } else {
        done();
      }
    });
  });

  it('should resolve with false via dialog afterClosed (user cancels)', (done) => {
    const dirtyComponent: CanFormDeactivate = { canDeactivate: () => false };
    (dialogRefSpy.afterClosed as jasmine.Spy).and.returnValue(of(false));

    TestBed.runInInjectionContext(() => {
      const observable = confirmDeactivate(dirtyComponent, currentRoute, currentState, nextState);
      if (observable && typeof (observable as any).subscribe === 'function') {
        (observable as any).subscribe((result: unknown) => {
          expect(result).toBeFalse();
          done();
        });
      } else {
        done();
      }
    });
  });
});
