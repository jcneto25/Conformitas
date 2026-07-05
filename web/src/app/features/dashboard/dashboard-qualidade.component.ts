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
  selector: 'app-dashboard-qualidade',
  standalone: true,
  imports: [
    MatCardModule, MatProgressSpinnerModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, FormsModule, RouterModule,
    BaseChartDirective, PageHeaderComponent, KpiCardComponent, EmptyStateComponent,
  ],
  template: `
    <app-page-header title="Dashboard Qualidade — PQAUD" />

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
        <app-kpi-card label="Total de Avaliações" [value]="dados.totalAvaliacoes ?? 0" icon="verified" accent="primary" />
        <app-kpi-card label="Avaliações Concluídas" [value]="dados.avaliacoesConcluidas ?? 0" icon="check_circle" accent="success" />
        <app-kpi-card label="Média das Notas" [value]="(dados.mediaNota != null ? dados.mediaNota : '—')" icon="trending_up" accent="info" />
        <app-kpi-card label="NCs Abertas" [value]="dados.naoConformidadesAbertas ?? 0" icon="error" accent="critical" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <mat-card class="shadow-sm rounded-xl">
          <mat-card-header><mat-card-title>Indicadores de Qualidade</mat-card-title></mat-card-header>
          <mat-card-content class="p-4">
            @if ((dados.indicadores ?? []).length === 0) {
              <app-empty-state icon="insights" title="Nenhum indicador cadastrado" size="sm" />
            } @else {
              <div class="space-y-2">
                @for (ind of dados.indicadores; track ind.id) {
                  <div class="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                    <span class="text-sm font-medium">{{ ind.nome }}</span>
                    <span class="text-sm text-text-sec">{{ ind.valor ?? ind.meta ?? '—' }}</span>
                  </div>
                }
              </div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="shadow-sm rounded-xl">
          <mat-card-header><mat-card-title>Não Conformidades</mat-card-title></mat-card-header>
          <mat-card-content class="p-4">
            @if (dados.totalNaoConformidades === 0) {
              <app-empty-state icon="warning" title="Nenhuma não conformidade" size="sm" />
            } @else {
              <div class="chart-container" style="position: relative; height: 250px;">
                <canvas baseChart [data]="ncDoughnutData" [options]="doughnutOptions" type="doughnut"></canvas>
              </div>
            }
          </mat-card-content>
        </mat-card>
      </div>

      <div class="mt-4">
        <button mat-raised-button color="primary" routerLink="/qualidade">
          <mat-icon>list</mat-icon> Ver Avaliações de Qualidade
        </button>
      </div>
    }
  `,
})
export class DashboardQualidadeComponent implements OnInit {
  loading = true;
  ano = 2026;
  dados: any = { totalAvaliacoes: 0, avaliacoesConcluidas: 0, mediaNota: null, totalNaoConformidades: 0, naoConformidadesAbertas: 0, indicadores: [] };

  ncDoughnutData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  readonly doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  constructor(private readonly api: ApiService) {}

  async ngOnInit() { await this.carregar(); }

  async carregar() {
    this.loading = true;
    try {
      this.dados = await this.api.getDashboardQualidade({});

      const abertasCount = this.dados.naoConformidadesAbertas ?? 0;
      const corrigidasCount = (this.dados.totalNaoConformidades ?? 0) - abertasCount;

      this.ncDoughnutData = {
        labels: ['Abertas', 'Corrigidas'],
        datasets: [{
          data: [abertasCount, Math.max(0, corrigidasCount)],
          backgroundColor: ['#dc2626', '#16a34a'],
        }],
      };
    } catch { this.dados = { totalAvaliacoes: 0, avaliacoesConcluidas: 0, mediaNota: null, totalNaoConformidades: 0, naoConformidadesAbertas: 0, indicadores: [] }; }
    finally { this.loading = false; }
  }
}
