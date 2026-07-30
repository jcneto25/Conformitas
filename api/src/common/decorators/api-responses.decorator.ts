import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiStandardResponses() {
  return applyDecorators(
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Não autenticado' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Perfil insuficiente' }),
    ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Erro de validação' }),
  );
}
