import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IConfiguracaoRepository, CONFIGURACAO_REPOSITORY } from './repositories/configuracao.repository';
@Injectable()
export class ConfigService {
  constructor(@Inject(CONFIGURACAO_REPOSITORY) private readonly repo: IConfiguracaoRepository) {}
  async findAll() {
    return this.repo.findAll();
  }
  async findOne(chave: string) {
    const config = await this.repo.findUnique(chave);
    if (!config) throw new NotFoundException('Configuração não encontrada');
    return config;
  }
  async update(chave: string, valor: string) {
    await this.findOne(chave);
    return this.repo.update(chave, valor);
  }
  async getValor(chave: string, padrao?: string): Promise<string> {
    const config = await this.repo.findUnique(chave);
    return config?.valor ?? padrao ?? '';
  }
}
