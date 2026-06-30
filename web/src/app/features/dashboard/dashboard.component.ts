import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../core/services/api.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, PageHeaderComponent],
  template: `
    <app-page-header title="Dashboard" />

    <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
      <mat-card>
        <mat-card-header>
          <mat-card-title class="text-sm font-medium text-text-sec">Auditorias em Andamento</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (loadingAuditorias) {
            <mat-spinner diameter="24" />
          } @else {
            <p class="text-3xl font-bold text-text-main my-2">{{ auditoriasEmExecucao }}</p>
            <p class="text-xs text-text-sec m-0">de {{ totalAuditorias }} auditorias</p>
          }
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title class="text-sm font-medium text-text-sec">Achados Pendentes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (loadingAchados) {
            <mat-spinner diameter="24" />
          } @else {
            <p class="text-3xl font-bold text-text-main my-2">{{ achadosPendentes }}</p>
            <p class="text-xs text-text-sec m-0">de {{ totalAchados }} achados</p>
          }
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title class="text-sm font-medium text-text-sec">Recomendações em Monitoramento</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (loadingRecomendacoes) {
            <mat-spinner diameter="24" />
          } @else {
            <p class="text-3xl font-bold text-text-main my-2">{{ recomendacoesMonitoradas }}</p>
            <p class="text-xs text-text-sec m-0">de {{ totalRecomendacoes }} recomendações</p>
          }
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title class="text-sm font-medium text-text-sec">PAA Vigente</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (loadingPlanos) {
            <mat-spinner diameter="24" />
          } @else {
            <p class="text-3xl font-bold text-text-main my-2">{{ planosPublicados }}</p>
            <p class="text-xs text-text-sec m-0">de {{ totalPlanos }} planos</p>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  loadingAuditorias = true;
  loadingAchados = true;
  loadingRecomendacoes = true;
  loadingPlanos = true;
  auditoriasEmExecucao = 0;
  totalAuditorias = 0;
  achadosPendentes = 0;
  totalAchados = 0;
  recomendacoesMonitoradas = 0;
  totalRecomendacoes = 0;
  planosPublicados = 0;
  totalPlanos = 0;

  constructor(private readonly api: ApiService) {}

  async ngOnInit() {
    try {
      const auditorias = await this.api.getAuditorias();
      this.totalAuditorias = auditorias.length;
      this.auditoriasEmExecucao = auditorias.filter(
        (a) => a.status === 'EM_EXECUCAO',
      ).length;
    } catch {
      this.totalAuditorias = 0;
    } finally {
      this.loadingAuditorias = false;
    }

    try {
      const achados = await this.api.getAchados();
      this.totalAchados = achados.length;
      this.achadosPendentes = achados.filter(
        (a) => a.status === 'PRELIMINAR' || a.status === 'EM_MANIFESTACAO',
      ).length;
    } catch {
      this.totalAchados = 0;
    } finally {
      this.loadingAchados = false;
    }

    try {
      const recomendacoes = await this.api.getRecomendacoes();
      this.totalRecomendacoes = recomendacoes.length;
      this.recomendacoesMonitoradas = recomendacoes.filter(
        (r) => r.status === 'PENDENTE' || r.status === 'EM_ANDAMENTO',
      ).length;
    } catch {
      this.totalRecomendacoes = 0;
    } finally {
      this.loadingRecomendacoes = false;
    }

    try {
      const planos = await this.api.getPlanos({ status: 'PUBLICADO' });
      const todos = await this.api.getPlanos();
      this.totalPlanos = todos.length;
      this.planosPublicados = planos.length;
    } catch {
      this.totalPlanos = 0;
    } finally {
      this.loadingPlanos = false;
    }
  }
}
