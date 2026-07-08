import { Injectable, Inject } from '@nestjs/common';
import { ILogSistemaRepository, LOG_SISTEMA_REPOSITORY } from './repositories/log-sistema.repository';
@Injectable()
export class LogsSistemaService {
  constructor(@Inject(LOG_SISTEMA_REPOSITORY) private readonly repo: ILogSistemaRepository) {}
  async findAll(params: any) {
    return this.repo.findMany(params);
  }
  async registrar(params: any) {
    return this.repo.create(params);
  }
}
