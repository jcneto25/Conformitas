import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AuditoriaListComponent } from './auditoria-list.component';

describe('AuditoriaListComponent', () => {
  let fixture: ComponentFixture<AuditoriaListComponent>;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpSpy.get.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AuditoriaListComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditoriaListComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render page header', () => {
    const el = fixture.debugElement.nativeElement;
    expect(el.textContent).toContain('Auditorias');
  });
});
