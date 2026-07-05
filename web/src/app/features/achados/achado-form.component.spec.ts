import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AchadoFormComponent } from './achado-form.component';

describe('AchadoFormComponent', () => {
  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    httpSpy.get.and.returnValue(of([]));
    httpSpy.post.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [AchadoFormComponent, FormsModule, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AchadoFormComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
