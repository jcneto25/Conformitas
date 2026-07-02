import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ApiService } from '../../core/services/api.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { KpiCardComponent } from '../../shared/components/kpi-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-dashboard-recomendacoes',
  standalone: true,
  imports: [
    MatCardModule, MatProgressSpinnerModule, MatIconModule,
    MatButtonModule, MatFormFieldModule, MatSelectModule,
    FormsModule, RouterModule, BaseChartDirective,
    PageHeaderComponent, KpiCardComponent, EmptyStateComponent,
  ],
  template: `
    <app-page-header title="Dashboard Recomendações" />

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
      <div class="flex justify-center py-12"><mat-spinner diameter="40" /></div>
    } @else {
      <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        <app-kpi-card label="Total de Recomendações" [value]="dados.total" icon="assignment" accent="primary" />
        <app-kpi-card label="Vencidas" [value]="dados.vencidas" icon="error" accent="critical" />
        <app-kpi-card label="No Prazo" [value]="dados.noPrazo" icon="check_circle" accent="success" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <mat-card class="shadow-sm rounded-xl">
          <mat-card-header><mat-card-title>Por Status</mat-card-title></mat-card-header>
          <mat-card-content class="p-4">
            @if (statusKeys.length === 0) {
              <app-empty-state icon="pie_chart" title="Nenhum dado disponível" size="sm" />
            } @else {
              <div class="chart-container" style="position: relative; height: 250px;">
                <canvas baseChart [data]="statusDoughnutData" [options]="doughnutOptions" type="doughnut"></canvas>
              </div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="shadow-sm rounded-xl">
          <mat-card-header><mat-card-title>Por Criticidade</mat-card-title></mat-card-header>
          <mat-card-content class="p-4">
            @if (criticidadeKeys.length === 0) {
              <app-empty-state icon="bar_chart" title="Nenhum dado disponível" size="sm" />
            } @else {
              <div class="chart-container" style="position: relative; height: 250px;">
                <canvas baseChart [data]="criticidadeBarData" [options]="barOptions" type="bar"></canvas>
              </div>
            }
          </mat-card-content>
        </mat-card>
      </div>

      <div class="mt-4">
        <button mat-raised-button color="primary" routerLink="/recomendacoes">
          <mat-icon>list</mat-icon> Ver Todas as Recomendações
        </button>
      </div>
    }
  `,
})
export class DashboardRecomendacoesComponent implements OnInit {
  loading = true;
  ano = 2026;
  dados: any = { porStatus: {}, porCriticidade: {}, total: 0, vencidas: 0, noPrazo: 0 };

  statusDoughnutData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  criticidadeBarData: ChartData<'bar'> = { labels: [], datasets: [] };

  readonly doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  readonly barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  constructor(private readonly api: ApiService) {}

  async ngOnInit() { await this.carregar(); }

  async carregar() {
    this.loading = true;
    try {
      this.dados = await this.api.getDashboardRecomendacoes();

      const statusKeys = Object.keys(this.dados.porStatus ?? {});
      const statusValues = Object.values(this.dados.porStatus ?? {}) as number[];
      this.statusDoughnutData = {
        labels: statusKeys,
        datasets: [{
          data: statusValues,
          backgroundColor: ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#c9a84c'],
        }],
      };

      const critKeys = Object.keys(this.dados.porCriticidade ?? {});
      const critValues = Object.values(this.dados.porCriticidade ?? {}) as number[];
      this.criticidadeBarData = {
        labels: critKeys,
        datasets: [{
          data: critValues,
          backgroundColor: ['#d97706', '#dc2626', '#2563eb', '#16a34a'],
          borderRadius: 4,
        }],
      };
    } catch { /* fallback padrão */ }
    finally { this.loading = false; }
  }

  get statusKeys() { return Object.keys(this.dados.porStatus ?? {}); }
  get criticidadeKeys() { return Object.keys(this.dados.porCriticidade ?? {}); }
}
