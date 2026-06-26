import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <h1>Dashboard</h1>
    <div class="dashboard-grid">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Auditorias em Andamento</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="metric">—</p>
          <p class="hint">Dados disponíveis após PRP-005</p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Achados Pendentes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="metric">—</p>
          <p class="hint">Dados disponíveis após PRP-006</p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Recomendações em Monitoramento</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="metric">—</p>
          <p class="hint">Dados disponíveis após PRP-008</p>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>PAA Vigente</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="metric">—</p>
          <p class="hint">Dados disponíveis após PRP-004</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      .metric {
        font-size: 2rem;
        font-weight: 700;
        margin: 0.5rem 0;
        color: #1a1a2e;
      }

      .hint {
        font-size: 0.8rem;
        color: #888;
        margin: 0;
      }
    `,
  ],
})
export class DashboardComponent {}
