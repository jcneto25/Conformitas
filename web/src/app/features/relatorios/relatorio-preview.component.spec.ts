import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { RelatorioPreviewComponent } from './relatorio-preview.component';

describe('RelatorioPreviewComponent', () => {
  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    httpSpy.get.and.returnValue(of([]));
    httpSpy.post.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [RelatorioPreviewComponent, FormsModule, NoopAnimationsModule],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RelatorioPreviewComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
