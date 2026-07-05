import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
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
  selector: 'app-dashboard-execucao',
  standalone: true,
  imports: [
    MatCardModule, MatProgressSpinnerModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, FormsModule, RouterModule,
    BaseChartDirective, PageHeaderComponent, KpiCardComponent, EmptyStateComponent,
  ],
  template: `
    <app-page-header title="Dashboard Execução" />

    <div class="filter-bar gap-4 mb-6 items-center">
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
        <app-kpi-card label="Total de Auditorias" [value]="dados.total ?? 0" icon="fact_check" accent="primary" />
        <app-kpi-card label="Em Execução" [value]="(dados.porStatus?.EM_EXECUCAO ?? 0)" icon="play_circle" accent="info" />
        <app-kpi-card label="Concluídas" [value]="(dados.porStatus?.CONCLUIDA ?? 0)" icon="check_circle" accent="success" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <mat-card class="shadow-sm rounded-xl">
          <mat-card-header><mat-card-title>Por Status</mat-card-title></mat-card-header>
          <mat-card-content class="p-4">
            @if (statusKeys.length === 0) {
              <app-empty-state icon="bar_chart" title="Nenhum dado" size="sm" />
            } @else {
              <div class="chart-container" style="position: relative; height: 250px;">
                <canvas baseChart [data]="statusBarData" [options]="barOptions" type="bar"></canvas>
              </div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="shadow-sm rounded-xl">
          <mat-card-header><mat-card-title>Por Tipo</mat-card-title></mat-card-header>
          <mat-card-content class="p-4">
            @if (tipoKeys.length === 0) {
              <app-empty-state icon="pie_chart" title="Nenhum dado" size="sm" />
            } @else {
              <div class="chart-container" style="position: relative; height: 250px;">
                <canvas baseChart [data]="tipoDoughnutData" [options]="doughnutOptions" type="doughnut"></canvas>
              </div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="shadow-sm rounded-xl">
          <mat-card-header><mat-card-title>Por Unidade</mat-card-title></mat-card-header>
          <mat-card-content class="p-4">
            @if (unidadeKeys.length === 0) {
              <app-empty-state icon="bar_chart" title="Nenhum dado" size="sm" />
            } @else {
              <div class="chart-container" style="position: relative; height: 250px;">
                <canvas baseChart [data]="unidadeBarData" [options]="barOptions" type="bar"></canvas>
              </div>
            }
          </mat-card-content>
        </mat-card>
      </div>

      <div class="mt-4">
        <button mat-raised-button color="primary" routerLink="/auditorias">
          <mat-icon>list</mat-icon> Ver Todas as Auditorias
        </button>
      </div>
    }
  `,
})
export class DashboardExecucaoComponent implements OnInit {
  loading = true;
  ano = 2026;
  dados: any = { porStatus: {}, porTipo: {}, porUnidade: {}, total: 0 };

  statusBarData: ChartData<'bar'> = { labels: [], datasets: [] };
  tipoDoughnutData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  unidadeBarData: ChartData<'bar'> = { labels: [], datasets: [] };

  readonly barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  readonly doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  constructor(private readonly api: ApiService) {}

  async ngOnInit() { await this.carregar(); }

  async carregar() {
    this.loading = true;
    try {
      this.dados = await this.api.getDashboardExecucao({});

      const colors = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#8b5cf6', '#ec4899'];

      this.statusBarData = this.buildBarDataset(this.dados.porStatus ?? {}, colors);
      this.tipoDoughnutData = this.buildDoughnutDataset(this.dados.porTipo ?? {}, colors);
      this.unidadeBarData = this.buildBarDataset(this.dados.porUnidade ?? {}, colors);
    } catch { this.dados = { porStatus: {}, porTipo: {}, porUnidade: {}, total: 0 }; }
    finally { this.loading = false; }
  }

  get statusKeys() { return Object.keys(this.dados.porStatus ?? {}); }
  get tipoKeys() { return Object.keys(this.dados.porTipo ?? {}); }
  get unidadeKeys() { return Object.keys(this.dados.porUnidade ?? {}); }

  private buildBarDataset(obj: Record<string, number>, colors: string[]): ChartData<'bar'> {
    return {
      labels: Object.keys(obj),
      datasets: [{ data: Object.values(obj), backgroundColor: colors.slice(0, Object.keys(obj).length), borderRadius: 4 }],
    };
  }

  private buildDoughnutDataset(obj: Record<string, number>, colors: string[]): ChartData<'doughnut'> {
    return {
      labels: Object.keys(obj),
      datasets: [{ data: Object.values(obj), backgroundColor: colors.slice(0, Object.keys(obj).length) }],
    };
  }
}
