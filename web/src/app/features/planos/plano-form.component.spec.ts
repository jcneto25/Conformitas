import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { PlanoFormComponent } from './plano-form.component';

describe('PlanoFormComponent', () => {
  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch']);
    httpSpy.get.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [PlanoFormComponent, FormsModule, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PlanoFormComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
