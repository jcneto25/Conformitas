import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { UsuarioPerfilFormComponent } from './usuario-perfil-form.component';

describe('UsuarioPerfilFormComponent', () => {
  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
    httpSpy.get.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [UsuarioPerfilFormComponent, FormsModule, NoopAnimationsModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }, provideRouter([])],
    }).compileComponents();
  });
  it('should create', () => expect(TestBed.createComponent(UsuarioPerfilFormComponent)).toBeTruthy());
});
