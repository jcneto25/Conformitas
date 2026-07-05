import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ConfiguracaoListComponent } from './configuracao-list.component';

describe('ConfiguracaoListComponent', () => {
  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpSpy.get.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [ConfiguracaoListComponent, FormsModule, NoopAnimationsModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    }).compileComponents();
  });
  it('should create', () => expect(TestBed.createComponent(ConfiguracaoListComponent)).toBeTruthy());
});
