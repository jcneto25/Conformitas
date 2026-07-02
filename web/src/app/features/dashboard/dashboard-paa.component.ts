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

@Component({
  selector: 'app-dashboard-paa',
  standalone: true,
  imports: [
    MatCardModule, MatProgressSpinnerModule, MatIconModule,
    MatButtonModule, MatFormFieldModule, MatSelectModule,
    FormsModule, RouterModule, BaseChartDirective,
    PageHeaderComponent, KpiCardComponent,
  ],
  template: `
    <app-page-header title="Dashboard PAA — Planejado × Executado" />

    <div class="filter-bar gap-4 mb-6 items-center">
      <mat-form-field appearance="outline" class="w-32">
        <mat-label>Ano</mat-label>
        <mat-select [(ngModel)]="ano" (selectionChange)="carregar()">
          @for (a of [2024, 2025, 2026, 2027]; track a) {
            <mat-option [value]="a">{{ a }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <button mat-stroked-button (click)="exportar('PDF')" [disabled]="loading">
        <mat-icon>picture_as_pdf</mat-icon> Exportar PDF
      </button>
      <button mat-stroked-button (click)="exportar('XLSX')" [disabled]="loading">
        <mat-icon>table_chart</mat-icon> Exportar XLSX
      </button>
    </div>

    @if (loading) {
      <div class="flex justify-center py-12"><mat-spinner diameter="40" /></div>
    } @else {
      <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        <app-kpi-card label="Total de Planos" [value]="dados.totalPlanos ?? 0" icon="description" accent="primary" />
        <app-kpi-card label="Planos Aprovados" [value]="dados.planosAprovados ?? 0" icon="check_circle" accent="success" />
        <app-kpi-card label="Alocação vs Disponibilidade" [value]="(dados.planejamentoPercentual ?? 0) + '%'" icon="trending_up" accent="warning" />
        <app-kpi-card label="Auditorias Concluídas" [value]="dados.auditoriasConcluidas ?? 0" icon="fact_check" accent="info" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <mat-card class="shadow-sm rounded-xl">
          <mat-card-header><mat-card-title>Planejado vs Executado</mat-card-title></mat-card-header>
          <mat-card-content class="p-4">
            <div class="chart-container" style="position: relative; height: 250px;">
              <canvas baseChart [data]="planejadoBarData" [options]="barOptions" type="bar"></canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="shadow-sm rounded-xl">
          <mat-card-header><mat-card-title>Horas</mat-card-title></mat-card-header>
          <mat-card-content class="p-4">
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-text-sec">Disponíveis</span>
                <span class="font-semibold">{{ dados.totalHorasDisponiveis ?? 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-sec">Alocadas (Auditoria)</span>
                <span class="font-semibold">{{ dados.totalHorasAlocadas ?? 0 }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" [style.width.%]="Math.min(dados.planejamentoPercentual ?? 0, 100)"></div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
})
export class DashboardPaaComponent implements OnInit {
  Math = Math;
  loading = true;
  ano = 2026;
  dados: any = {};

  planejadoBarData: ChartData<'bar'> = {
    labels: ['Planejado', 'Executado'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#2563eb', '#16a34a'],
      borderRadius: 4,
    }],
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
      this.dados = await this.api.getDashboardPaa({ ano: this.ano });
      this.planejadoBarData = {
        labels: ['Planejado', 'Executado'],
        datasets: [{
          data: [this.dados.totalPlanos ?? 0, this.dados.auditoriasConcluidas ?? 0],
          backgroundColor: ['#2563eb', '#16a34a'],
          borderRadius: 4,
        }],
      };
    } catch { this.dados = {}; }
    finally { this.loading = false; }
  }

  async exportar(formato: string) {
    try {
      const blob = await this.api.exportarDashboard('paa', formato, { ano: this.ano }) as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `dashboard-paa.${formato.toLowerCase()}`; a.click();
      URL.revokeObjectURL(url);
    } catch { console.error('Erro ao exportar'); }
  }
}
