import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ValidationService] });
    service = TestBed.inject(ValidationService);
  });

  it('should return required message with label', () => {
    expect(service.required('Nome')).toBe('Nome é obrigatório');
  });

  it('should return minlength message', () => {
    expect(service.minlength('Senha', 8)).toBe('Senha deve ter no mínimo 8 caracteres');
  });

  it('should return maxlength message', () => {
    expect(service.maxlength('Descrição', 200)).toBe('Descrição deve ter no máximo 200 caracteres');
  });

  it('should return email message', () => {
    expect(service.email('E-mail')).toBe('E-mail deve ser um e-mail válido');
  });

  it('should return pattern message', () => {
    expect(service.pattern()).toBe('Formato inválido');
  });

  it('should return min message', () => {
    expect(service.min('Nota', 0)).toBe('Nota deve ser no mínimo 0');
  });
});
