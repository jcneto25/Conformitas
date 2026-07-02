import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const API = 'http://localhost:3001/api/v1';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  // ── Módulos existentes ────────────────────────
  getAuditorias(params?: { status?: string }) {
    return firstValueFrom(this.http.get<any[]>(`${API}/auditorias`, { params }));
  }

  getPlanos(params?: { status?: string }) {
    return firstValueFrom(this.http.get<any[]>(`${API}/planos`, { params }));
  }

  getAchados(params?: { status?: string }) {
    return firstValueFrom(this.http.get<any[]>(`${API}/achados`, { params }));
  }

  getRecomendacoes(params?: { status?: string }) {
    return firstValueFrom(this.http.get<any[]>(`${API}/recomendacoes`, { params }));
  }

  // ── Dashboards (PRP-014) ──────────────────────
  getDashboardPaa(params?: { ano?: number; periodoInicio?: string; periodoFim?: string }) {
    return firstValueFrom(this.http.get<any>(`${API}/dashboards/paa`, { params }));
  }

  getDashboardExecucao(params?: { periodoInicio?: string; periodoFim?: string; unidade?: string }) {
    return firstValueFrom(this.http.get<any>(`${API}/dashboards/execucao`, { params }));
  }

  getDashboardRecomendacoes(params?: { periodoInicio?: string; periodoFim?: string }) {
    return firstValueFrom(this.http.get<any>(`${API}/dashboards/recomendacoes`, { params }));
  }

  getDashboardQualidade(params?: { periodoInicio?: string; periodoFim?: string }) {
    return firstValueFrom(this.http.get<any>(`${API}/dashboards/qualidade`, { params }));
  }

  exportarDashboard(tipo: string, formato: string, params?: any) {
    return firstValueFrom(this.http.post(`${API}/dashboards/export/${tipo}`, null, {
      params: { formato, ...params },
      responseType: 'blob',
    }));
  }

  // ── Integrações (PRP-014) ─────────────────────
  getIntegracoes() {
    return firstValueFrom(this.http.get<any[]>(`${API}/integracoes`));
  }

  getIntegracao(id: string) {
    return firstValueFrom(this.http.get<any>(`${API}/integracoes/${id}`));
  }

  criarIntegracao(data: any) {
    return firstValueFrom(this.http.post<any>(`${API}/integracoes`, data));
  }

  atualizarIntegracao(id: string, data: any) {
    return firstValueFrom(this.http.patch<any>(`${API}/integracoes/${id}`, data));
  }

  removerIntegracao(id: string) {
    return firstValueFrom(this.http.delete(`${API}/integracoes/${id}`));
  }

  healthCheckIntegracao(id: string) {
    return firstValueFrom(this.http.post<any>(`${API}/integracoes/${id}/health`, {}));
  }

  healthAllIntegracoes() {
    return firstValueFrom(this.http.get<any[]>(`${API}/integracoes/health/all`));
  }

  // ── Ações Coordenadas (PRP-014) ───────────────
  getAcoesCoordenadas() {
    return firstValueFrom(this.http.get<any[]>(`${API}/acoes-coordenadas`));
  }

  getAcaoCoordenada(id: string) {
    return firstValueFrom(this.http.get<any>(`${API}/acoes-coordenadas/${id}`));
  }

  criarAcaoCoordenada(data: any) {
    return firstValueFrom(this.http.post<any>(`${API}/acoes-coordenadas`, data));
  }

  atualizarAcaoCoordenada(id: string, data: any) {
    return firstValueFrom(this.http.patch<any>(`${API}/acoes-coordenadas/${id}`, data));
  }

  reportarResultadoCPA(id: string, data: { auditoriaId: string }) {
    return firstValueFrom(this.http.post<any>(`${API}/acoes-coordenadas/${id}/reportar`, data));
  }

  // ── Universo Auditável (PRP-003) ──────────────
  getUniverso(params?: { tipo?: string; search?: string }) {
    return firstValueFrom(this.http.get<any[]>(`${API}/universo-auditavel`, { params }));
  }

  getUniversoItem(id: string) {
    return firstValueFrom(this.http.get<any>(`${API}/universo-auditavel/${id}`));
  }

  criarUniversoItem(data: any) {
    return firstValueFrom(this.http.post<any>(`${API}/universo-auditavel`, data));
  }

  atualizarUniversoItem(id: string, data: any) {
    return firstValueFrom(this.http.patch<any>(`${API}/universo-auditavel/${id}`, data));
  }

  removerUniversoItem(id: string) {
    return firstValueFrom(this.http.delete(`${API}/universo-auditavel/${id}`));
  }
}
