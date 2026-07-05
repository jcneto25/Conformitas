import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule, MatProgressSpinnerModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, MatButtonModule,
    FormsModule, RouterModule, BaseChartDirective,
  ],
  template: `
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h2 class="text-[32px] leading-[40px] font-semibold text-text-main tracking-tight">Dashboard</h2>
        <p class="text-sm text-text-sec mt-1">Vis&atilde;o geral do sistema de integridade</p>
      </div>
      <mat-form-field appearance="outline" class="w-full md:w-44">
        <mat-label>Ano</mat-label>
        <mat-select [(ngModel)]="ano" (selectionChange)="carregar()">
          @for (a of anos; track a) {
            <mat-option [value]="a">{{ a }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>

    @if (loading) {
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (i of [1,2,3,4]; track i) {
          <mat-card class="shadow-sm rounded-xl">
            <mat-card-content class="p-6">
              <div class="animate-pulse flex justify-between items-start">
                <div class="space-y-3 flex-1">
                  <div class="h-12 w-16 bg-gray-200 rounded"></div>
                  <div class="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
                <div class="h-10 w-10 bg-gray-200 rounded-lg"></div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        @for (i of [1,2]; track i) {
          <mat-card class="shadow-sm rounded-xl">
            <mat-card-content class="p-6">
              <div class="animate-pulse">
                <div class="h-6 w-48 bg-gray-200 rounded mb-6"></div>
                <div class="h-72 bg-gray-200 rounded"></div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    } @else {
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <mat-card class="shadow-[0_2px_4px_rgba(0,0,0,0.04)] rounded-xl border border-divider hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-200 group">
          <mat-card-content class="p-6">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[48px] leading-[56px] font-bold text-primary group-hover:scale-105 transition-transform duration-300">{{ auditoriasEmExecucao }}</span>
              <div class="bg-primary/10 p-2 rounded-lg">
                <mat-icon class="text-primary">assignment_turned_in</mat-icon>
              </div>
            </div>
            <p class="text-xs font-semibold text-text-sec uppercase tracking-wider">Auditorias em Andamento (de {{ totalAuditorias }})</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="shadow-[0_2px_4px_rgba(0,0,0,0.04)] rounded-xl border border-divider hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-200 group">
          <mat-card-content class="p-6">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[48px] leading-[56px] font-bold text-info group-hover:scale-105 transition-transform duration-300">{{ auditoriasConcluidas }}</span>
              <div class="bg-green-100 p-2 rounded-lg">
                <mat-icon class="text-success">check_circle</mat-icon>
              </div>
            </div>
            <p class="text-xs font-semibold text-text-sec uppercase tracking-wider">Auditorias Conclu&iacute;das</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="shadow-[0_2px_4px_rgba(0,0,0,0.04)] rounded-xl border border-divider hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-200 group">
          <mat-card-content class="p-6">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[48px] leading-[56px] font-bold text-blue-700 group-hover:scale-105 transition-transform duration-300">{{ recomendacoesMonitoradas }}</span>
              <div class="bg-blue-100 p-2 rounded-lg">
                <mat-icon class="text-blue-700">info</mat-icon>
              </div>
            </div>
            <p class="text-xs font-semibold text-text-sec uppercase tracking-wider">Recomenda&ccedil;&otilde;es em Monitor. (de {{ totalRecomendacoes }})</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="shadow-[0_2px_4px_rgba(0,0,0,0.04)] rounded-xl border border-divider hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-200 group">
          <mat-card-content class="p-6">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[48px] leading-[56px] font-bold text-critical group-hover:scale-105 transition-transform duration-300">{{ recomendacoesVencidas }}</span>
              <div class="bg-critical-bg p-2 rounded-lg">
                <mat-icon class="text-critical">report</mat-icon>
              </div>
            </div>
            <p class="text-xs font-semibold text-text-sec uppercase tracking-wider">Recomenda&ccedil;&otilde;es Vencidas</p>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <mat-card class="shadow-[0_2px_4px_rgba(0,0,0,0.04)] rounded-xl border border-divider">
          <div class="flex items-center justify-between px-6 pt-6">
            <h3 class="text-xl font-medium text-text-main">Auditorias por Status</h3>
            <button mat-icon-button class="!text-text-sec">
              <mat-icon>more_vert</mat-icon>
            </button>
          </div>
          <mat-card-content class="p-6 pt-2">
            <div class="chart-container" style="position: relative; height: 300px;">
              <canvas baseChart [data]="auditoriasBarData" [options]="barOptions" type="bar"></canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="shadow-[0_2px_4px_rgba(0,0,0,0.04)] rounded-xl border border-divider">
          <div class="flex items-center justify-between px-6 pt-6">
            <h3 class="text-xl font-medium text-text-main">Recomenda&ccedil;&otilde;es por Status</h3>
            <button mat-icon-button class="!text-text-sec">
              <mat-icon>more_vert</mat-icon>
            </button>
          </div>
          <mat-card-content class="p-6 pt-2">
            <div class="chart-container" style="position: relative; height: 300px;">
              <canvas baseChart [data]="recomendacoesDoughnutData" [options]="doughnutOptions" type="doughnut"></canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4 pt-8 mt-6 border-t border-divider">
        <button mat-stroked-button routerLink="/dashboard/execucao" class="!rounded-full !px-6">
          <mat-icon class="!text-primary mr-1">play_circle</mat-icon>
          Dashboard Execu&ccedil;&atilde;o
        </button>
        <button mat-stroked-button routerLink="/dashboard/recomendacoes" class="!rounded-full !px-6">
          <mat-icon class="!text-primary mr-1">assignment_late</mat-icon>
          Dashboard Recomenda&ccedil;&otilde;es
        </button>
        <button mat-stroked-button routerLink="/dashboard/paa" class="!rounded-full !px-6">
          <mat-icon class="!text-primary mr-1">bar_chart</mat-icon>
          Dashboard PAA
        </button>
        <button mat-stroked-button routerLink="/dashboard/qualidade" class="!rounded-full !px-6">
          <mat-icon class="!text-primary mr-1">verified_user</mat-icon>
          Dashboard Qualidade
        </button>
      </div>
    }
  `,
})
export class DashboardComponent implements OnInit {
  loading = true;
  ano = 2026;
  anos = [2024, 2025, 2026, 2027];
  auditoriasEmExecucao = 0;
  auditoriasConcluidas = 0;
  totalAuditorias = 0;
  recomendacoesMonitoradas = 0;
  recomendacoesVencidas = 0;
  totalRecomendacoes = 0;

  auditoriasBarData: ChartData<'bar'> = { labels: [], datasets: [] };
  recomendacoesDoughnutData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  readonly barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: '#eaecf0' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  readonly doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyleWidth: 10,
          padding: 16,
          font: { size: 11 },
        },
      },
    },
  };

  constructor(private readonly api: ApiService) {}

  async ngOnInit() { await this.carregar(); }

  async carregar() {
    this.loading = true;
    try {
      const [execucao, recomendacoes] = await Promise.all([
        this.api.getDashboardExecucao({}).catch(() => ({ total: 0, porStatus: {}, porTipo: {}, porUnidade: {} })),
        this.api.getDashboardRecomendacoes({}).catch(() => ({ total: 0, porStatus: {}, porCriticidade: {}, vencidas: 0, noPrazo: 0 })),
      ]);

      this.totalAuditorias = execucao.total ?? 0;
      this.auditoriasEmExecucao = execucao.porStatus?.EM_EXECUCAO ?? 0;
      this.auditoriasConcluidas = execucao.porStatus?.CONCLUIDA ?? 0;

      const audStatusKeys = Object.keys(execucao.porStatus ?? {});
      const audStatusValues = Object.values(execucao.porStatus ?? {}) as number[];
      this.auditoriasBarData = {
        labels: audStatusKeys,
        datasets: [{
          data: audStatusValues,
          backgroundColor: ['#316bf3', '#16a34a', '#d97706', '#dc2626'],
          borderRadius: 6,
          maxBarThickness: 120,
        }],
      };

      this.totalRecomendacoes = recomendacoes.total ?? 0;
      this.recomendacoesMonitoradas = (recomendacoes.porStatus?.PENDENTE ?? 0) + (recomendacoes.porStatus?.EM_ANDAMENTO ?? 0);
      this.recomendacoesVencidas = recomendacoes.vencidas ?? 0;

      const recStatusKeys = Object.keys(recomendacoes.porStatus ?? {});
      const recStatusValues = Object.values(recomendacoes.porStatus ?? {}) as number[];
      this.recomendacoesDoughnutData = {
        labels: recStatusKeys,
        datasets: [{
          data: recStatusValues,
          backgroundColor: ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#8b5cf6'],
          borderWidth: 2,
          borderColor: '#ffffff',
        }],
      };
    } catch {
      // fallback padrão
    } finally {
      this.loading = false;
    }
  }
}
