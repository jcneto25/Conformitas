import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from '../../core/services/api.service';
import { IntegracaoListComponent } from './integracao-list.component';

describe('IntegracaoListComponent', () => {
  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getIntegracoes']);
    apiSpy.getIntegracoes.and.returnValue(Promise.resolve([]));
    await TestBed.configureTestingModule({
      imports: [IntegracaoListComponent, NoopAnimationsModule],
      providers: [{ provide: ApiService, useValue: apiSpy }, provideRouter([])],
    }).compileComponents();
  });
  it('should create', () => expect(TestBed.createComponent(IntegracaoListComponent)).toBeTruthy());
});
