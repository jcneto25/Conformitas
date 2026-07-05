import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from '../../core/services/api.service';
import { IntegracaoFormComponent } from './integracao-form.component';

describe('IntegracaoFormComponent', () => {
  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getIntegracao', 'criarIntegracao', 'atualizarIntegracao']);
    apiSpy.getIntegracao.and.returnValue(Promise.resolve({}));
    await TestBed.configureTestingModule({
      imports: [IntegracaoFormComponent, FormsModule, NoopAnimationsModule],
      providers: [{ provide: ApiService, useValue: apiSpy }, provideRouter([])],
    }).compileComponents();
  });
  it('should create', () => expect(TestBed.createComponent(IntegracaoFormComponent)).toBeTruthy());
});
