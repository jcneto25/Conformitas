import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatrizPriorizacaoComponent } from './matriz-priorizacao.component';

describe('MatrizPriorizacaoComponent', () => {
  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpSpy.get.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [MatrizPriorizacaoComponent, FormsModule, NoopAnimationsModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    }).compileComponents();
  });
  it('should create', () => expect(TestBed.createComponent(MatrizPriorizacaoComponent)).toBeTruthy());
});
