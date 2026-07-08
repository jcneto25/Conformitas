import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  ISolicitacaoConsultoriaRepository,
  SOLICITACAO_CONSULTORIA_REPOSITORY,
} from './repositories/solicitacao-consultoria.repository';
import { IConsultoriaRepository, CONSULTORIA_REPOSITORY } from './repositories/consultoria.repository';

const TIPOS_VALIDOS = ['ASSESSORAMENTO', 'CONSULTORIA', 'COGESTAO'];

@Injectable()
export class ConsultoriasService {
  constructor(
    @Inject(SOLICITACAO_CONSULTORIA_REPOSITORY) private readonly solicitacaoRepo: ISolicitacaoConsultoriaRepository,
    @Inject(CONSULTORIA_REPOSITORY) private readonly consultoriaRepo: IConsultoriaRepository,
  ) {}

  async criarSolicitacao(dto: any) {
    return this.solicitacaoRepo.create({ ...dto, status: 'PENDENTE' });
  }
  async listarSolicitacoes(status?: string) {
    return this.solicitacaoRepo.findMany(status);
  }
  async aceitarSolicitacao(id: string) {
    const s = await this.solicitacaoRepo.findUnique(id);
    if (!s) throw new NotFoundException('Solicitação não encontrada');
    if (s.status !== 'PENDENTE') throw new BadRequestException('Apenas solicitações PENDENTE podem ser aceitas');
    return this.solicitacaoRepo.update(id, { status: 'ACEITA' });
  }
  async recusarSolicitacao(id: string) {
    const s = await this.solicitacaoRepo.findUnique(id);
    if (!s) throw new NotFoundException('Solicitação não encontrada');
    if (s.status !== 'PENDENTE') throw new BadRequestException('Apenas solicitações PENDENTE podem ser recusadas');
    return this.solicitacaoRepo.update(id, { status: 'RECUSADA' });
  }
  async concluirSolicitacao(id: string, resultado: string) {
    const s = await this.solicitacaoRepo.findUnique(id);
    if (!s) throw new NotFoundException('Solicitação não encontrada');
    if (s.status !== 'ACEITA') throw new BadRequestException('Apenas solicitações ACEITAS podem ser concluídas');
    await this.solicitacaoRepo.update(id, { status: 'CONCLUIDA' });
    const consultorias = await this.consultoriaRepo.findBySolicitacao(id);
    for (const c of consultorias) {
      await this.consultoriaRepo.update(c.id, {
        resultado: `${resultado}\n\n---\nEsta consultoria não configura ato de gestão`,
      });
    }
    return { mensagem: 'Consultoria concluída' };
  }
  async registrarConsultoria(dto: any) {
    if (!TIPOS_VALIDOS.includes(dto.tipo))
      throw new BadRequestException(`Tipo inválido. Válidos: ${TIPOS_VALIDOS.join(', ')}`);
    return this.consultoriaRepo.create(dto);
  }
  async listarConsultorias(tipo?: string) {
    return this.consultoriaRepo.findAll(tipo);
  }
  async findOne(id: string) {
    const c = await this.consultoriaRepo.findUnique(id);
    if (!c) throw new NotFoundException('Consultoria não encontrada');
    return c;
  }
  async findAll() {
    return this.consultoriaRepo.findAll();
  }
}
