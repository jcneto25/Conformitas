import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { QuadroAchadosComponent } from './quadro-achados.component';

describe('QuadroAchadosComponent', () => {
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpSpy.get.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [QuadroAchadosComponent, FormsModule, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(QuadroAchadosComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
