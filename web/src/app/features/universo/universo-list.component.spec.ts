import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { UniversoListComponent } from './universo-list.component';

describe('UniversoListComponent', () => {
  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'delete']);
    httpSpy.get.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [UniversoListComponent, NoopAnimationsModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }, provideRouter([])],
    }).compileComponents();
  });
  it('should create', () => expect(TestBed.createComponent(UniversoListComponent)).toBeTruthy());
});
