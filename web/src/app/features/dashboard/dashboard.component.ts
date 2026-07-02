import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ApiService } from '../../core/services/api.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { KpiCardComponent } from '../../shared/components/kpi-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule, MatProgressSpinnerModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, FormsModule,
    BaseChartDirective, PageHeaderComponent, KpiCardComponent,
  ],
  template: `
    <app-page-header title="Dashboard" />

    <div class="filter-bar gap-4 mb-6">
      <mat-form-field appearance="outline" class="w-32">
        <mat-label>Ano</mat-label>
        <mat-select [(ngModel)]="ano" (selectionChange)="carregar()">
          @for (a of [2024, 2025, 2026, 2027]; track a) {
            <mat-option [value]="a">{{ a }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>

    @if (loading) {
      <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        @for (i of [1,2,3,4]; track i) {
          <app-kpi-card label="..." value="" [loading]="true" />
        }
      </div>
    } @else {
      <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        <app-kpi-card label="Auditorias em Andamento (de {{ totalAuditorias }})" [value]="auditoriasEmExecucao" icon="fact_check" accent="primary" />
        <app-kpi-card label="Achados Pendentes (de {{ totalAchados }})" [value]="achadosPendentes" icon="flag" accent="warning" />
        <app-kpi-card label="Recomendações em Monitoramento (de {{ totalRecomendacoes }})" [value]="recomendacoesMonitoradas" icon="assignment_late" accent="info" />
        <app-kpi-card label="PAA Vigente (de {{ totalPlanos }} planos)" [value]="planosPublicados" icon="description" accent="success" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <mat-card class="shadow-sm rounded-xl">
          <mat-card-header><mat-card-title>Auditorias por Status</mat-card-title></mat-card-header>
          <mat-card-content class="p-4">
            <div class="chart-container" style="position: relative; height: 250px;">
              <canvas baseChart [data]="auditoriasBarData" [options]="barOptions" type="bar"></canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="shadow-sm rounded-xl">
          <mat-card-header><mat-card-title>Recomendações por Status</mat-card-title></mat-card-header>
          <mat-card-content class="p-4">
            <div class="chart-container" style="position: relative; height: 250px;">
              <canvas baseChart [data]="recomendacoesDoughnutData" [options]="doughnutOptions" type="doughnut"></canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
})
export class DashboardComponent implements OnInit {
  loading = true;
  ano = 2026;
  auditoriasEmExecucao = 0;
  totalAuditorias = 0;
  achadosPendentes = 0;
  totalAchados = 0;
  recomendacoesMonitoradas = 0;
  totalRecomendacoes = 0;
  planosPublicados = 0;
  totalPlanos = 0;

  auditoriasBarData: ChartData<'bar'> = { labels: [], datasets: [] };
  recomendacoesDoughnutData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  readonly barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  readonly doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  constructor(private readonly api: ApiService) {}

  async ngOnInit() { await this.carregar(); }

  async carregar() {
    this.loading = true;
    try {
      const [auditorias, achados, recomendacoes, planos] = await Promise.all([
        this.api.getAuditorias().catch(() => [] as any[]),
        this.api.getAchados().catch(() => [] as any[]),
        this.api.getRecomendacoes().catch(() => [] as any[]),
        this.api.getPlanos(),
      ]);

      this.totalAuditorias = auditorias.length;
      this.auditoriasEmExecucao = auditorias.filter((a) => a.status === 'EM_EXECUCAO').length;

      this.totalAchados = achados.length;
      this.achadosPendentes = achados.filter(
        (a) => a.status === 'PRELIMINAR' || a.status === 'EM_MANIFESTACAO',
      ).length;

      this.totalRecomendacoes = recomendacoes.length;
      this.recomendacoesMonitoradas = recomendacoes.filter(
        (r) => r.status === 'PENDENTE' || r.status === 'EM_ANDAMENTO',
      ).length;

      this.totalPlanos = planos.length;
      this.planosPublicados = planos.filter((p) => p.status === 'PUBLICADO' || p.status === 'APROVADO').length;

      const audStatusCount = this.countBy(auditorias, 'status');
      this.auditoriasBarData = {
        labels: Object.keys(audStatusCount),
        datasets: [{
          data: Object.values(audStatusCount),
          backgroundColor: ['#2563eb', '#16a34a', '#d97706', '#dc2626'],
          borderRadius: 4,
        }],
      };

      const recStatusCount = this.countBy(recomendacoes, 'status');
      this.recomendacoesDoughnutData = {
        labels: Object.keys(recStatusCount),
        datasets: [{
          data: Object.values(recStatusCount),
          backgroundColor: ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#c9a84c'],
        }],
      };
    } catch {
      // fallback padrão
    } finally {
      this.loading = false;
    }
  }

  private countBy(arr: any[], key: string): Record<string, number> {
    return arr.reduce((acc: Record<string, number>, item: any) => {
      const k = item[key] ?? 'DESCONHECIDO';
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {});
  }
}
