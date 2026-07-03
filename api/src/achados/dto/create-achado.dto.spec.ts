import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateAchadoDto } from './create-achado.dto';

/**
 * RF-006.2 — criar achado sem um dos 4 atributos (situação/critério/causa/efeito)
 * deve ser rejeitado. A regra vive no DTO (class-validator); combinada com o
 * ValidationPipe global (errorHttpStatusCode: 422 em main.ts), gera HTTP 422 —
 * teste #2 do PRP-006 ("Criar achado sem critério → 422").
 */
describe('CreateAchadoDto (RF-006.2)', () => {
  const base = {
    tipo: 'NEGATIVO',
    situacaoEncontrada: 'situação',
    criterio: 'critério',
    causa: 'causa',
    efeito: 'efeito',
  };

  it('aceita DTO com os 4 atributos preenchidos', async () => {
    const errs = await validate(plainToInstance(CreateAchadoDto, base));
    expect(errs).toHaveLength(0);
  });

  it('rejeita sem critério com a mensagem CNJ', async () => {
    const errs = await validate(plainToInstance(CreateAchadoDto, { ...base, criterio: '' }));
    const criterioErr = errs.find((e) => e.property === 'criterio');
    expect(criterioErr).toBeDefined();
    expect(JSON.stringify(criterioErr)).toContain('Critério é obrigatório (CNJ 309 art. 46)');
  });

  it('rejeita sem cada um dos demais atributos (situação/causa/efeito)', async () => {
    for (const campo of ['situacaoEncontrada', 'causa', 'efeito']) {
      const errs = await validate(plainToInstance(CreateAchadoDto, { ...base, [campo]: '' }));
      expect(errs.some((e) => e.property === campo)).toBe(true);
    }
  });

  it('rejeita tipo fora de POSITIVO/NEGATIVO', async () => {
    const errs = await validate(plainToInstance(CreateAchadoDto, { ...base, tipo: 'IRREGULARIDADE' }));
    expect(errs.some((e) => e.property === 'tipo')).toBe(true);
  });
});
