import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ValidationService {
  required(label: string): string {
    return `${label} é obrigatório`;
  }

  minlength(label: string, min: number): string {
    return `${label} deve ter no mínimo ${min} caracteres`;
  }

  maxlength(label: string, max: number): string {
    return `${label} deve ter no máximo ${max} caracteres`;
  }

  email(label: string): string {
    return `${label} deve ser um e-mail válido`;
  }

  pattern(): string {
    return 'Formato inválido';
  }

  min(label: string, min: number): string {
    return `${label} deve ser no mínimo ${min}`;
  }
}
