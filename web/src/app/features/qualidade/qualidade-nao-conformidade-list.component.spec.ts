import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { QualidadeNaoConformidadeListComponent } from './qualidade-nao-conformidade-list.component';

describe('QualidadeNaoConformidadeListComponent', () => {
  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'put']);
    httpSpy.get.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [QualidadeNaoConformidadeListComponent, FormsModule, NoopAnimationsModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    }).compileComponents();
  });
  it('should create', () => expect(TestBed.createComponent(QualidadeNaoConformidadeListComponent)).toBeTruthy());
});
