import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { DeterminacaoListComponent } from './determinacao-list.component';

describe('DeterminacaoListComponent', () => {
  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpSpy.get.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [DeterminacaoListComponent, NoopAnimationsModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }, provideRouter([])],
    }).compileComponents();
  });
  it('should create', () => expect(TestBed.createComponent(DeterminacaoListComponent)).toBeTruthy());
});
