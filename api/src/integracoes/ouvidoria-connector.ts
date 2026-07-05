// ── Conector Ouvidoria TJCE (PRP-014) ────────────────

import { Injectable } from '@nestjs/common';

export interface ManifestacaoOuvidoria {
  id: string;
  protocolo: string;
  assunto: string;
  descricao: string;
  dataAbertura: string;
  status: string;
  unidadeVinculada?: string;
}

@Injectable()
export class OuvidoriaConnector {
  // Configuração de acesso – em produção viria de variáveis de ambiente
  private readonly baseUrl = process.env['OUVIDORIA_API_URL'] || 'https://ouvidoria.tjce.jus.br/api/v1';
  private readonly apiKey = process.env['OUVIDORIA_API_KEY'] || '';

  async buscarManifestacoes(filtros?: {
    dataInicio?: string;
    dataFim?: string;
    unidade?: string;
  }): Promise<ManifestacaoOuvidoria[]> {
    try {
      const params = new URLSearchParams();
      if (filtros?.dataInicio) params.set('dataInicio', filtros.dataInicio);
      if (filtros?.dataFim) params.set('dataFim', filtros.dataFim);
      if (filtros?.unidade) params.set('unidade', filtros.unidade);

      const url = `${this.baseUrl}/manifestacoes?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`Ouvidoria retornou HTTP ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.data ?? [];
    } catch {
      return [];
    }
  }

  async buscarManifestacaoPorProtocolo(protocolo: string): Promise<ManifestacaoOuvidoria | null> {
    try {
      const url = `${this.baseUrl}/manifestacoes/${protocolo}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }
}
