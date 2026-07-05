import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from '../../core/services/api.service';
import { AcaoCoordenadaListComponent } from './acao-coordenada-list.component';

describe('AcaoCoordenadaListComponent', () => {
  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getAcoesCoordenadas']);
    apiSpy.getAcoesCoordenadas.and.returnValue(Promise.resolve([]));
    await TestBed.configureTestingModule({
      imports: [AcaoCoordenadaListComponent, NoopAnimationsModule],
      providers: [{ provide: ApiService, useValue: apiSpy }, provideRouter([])],
    }).compileComponents();
  });
  it('should create', () => expect(TestBed.createComponent(AcaoCoordenadaListComponent)).toBeTruthy());
});
