import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ClassificacaoSelectorComponent } from './classificacao-selector.component';

describe('ClassificacaoSelectorComponent', () => {
  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'post']);
    httpSpy.get.and.returnValue(of(null));
    await TestBed.configureTestingModule({
      imports: [ClassificacaoSelectorComponent, FormsModule, NoopAnimationsModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    }).compileComponents();
  });
  it('should create', () => expect(TestBed.createComponent(ClassificacaoSelectorComponent)).toBeTruthy());
});
