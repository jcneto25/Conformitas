import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { RelatorioAnualFormComponent } from './relatorio-anual-form.component';

describe('RelatorioAnualFormComponent', () => {
  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['post']);
    httpSpy.post.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [RelatorioAnualFormComponent, FormsModule, NoopAnimationsModule],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RelatorioAnualFormComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
