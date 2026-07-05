import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from '../../core/services/api.service';
import { AcaoCoordenadaDetailComponent } from './acao-coordenada-detail.component';

describe('AcaoCoordenadaDetailComponent', () => {
  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getAcaoCoordenada']);
    apiSpy.getAcaoCoordenada.and.returnValue(Promise.resolve({}));
    await TestBed.configureTestingModule({
      imports: [AcaoCoordenadaDetailComponent, FormsModule, NoopAnimationsModule],
      providers: [{ provide: ApiService, useValue: apiSpy }, provideRouter([])],
    }).compileComponents();
  });
  it('should create', () => expect(TestBed.createComponent(AcaoCoordenadaDetailComponent)).toBeTruthy());
});
