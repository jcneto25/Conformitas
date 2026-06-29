import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-painel-monitoramento',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatChipsModule, MatProgressSpinnerModule,
    MatIconModule, MatTableModule, MatButtonModule,
  ],
  template: `
    <h1>Painel de Monitoramento (P01, P06)</h1>

    <!-- Cards de status -->
    <div class="status-grid">
      <mat-card>
        <mat-card-content>
          <div class="card-metric" style="color: #1565c0;">{{ pendentes }}</div>
          <div class="card-label">Pendentes</div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-content>
          <div class="card-metric" style="color: #e65100;">{{ emAndamento }}</div>
          <div class="card-label">Em Andamento</div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-content>
          <div class="card-metric" style="color: #2e7d32;">{{ cumpridas }}</div>
          <div class="card-label">Cumpridas</div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-content>
          <div class="card-metric" style="color: #c62828;">{{ vencidas }}</div>
          <div class="card-label">Vencidas</div>
        </mat-card-content>
      </mat-card>
    </div>

    <!-- Vencidas em destaque -->
    <mat-card *ngIf="recomendacoesVencidas.length" style="margin-top: 1rem; border-left: 4px solid #c62828;">
      <mat-card-header>
        <mat-card-title style="color: #c62828;">
          <mat-icon style="vertical-align: middle;">warning</mat-icon>
          Recomendações Vencidas ({{ recomendacoesVencidas.length }})
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="recomendacoesVencidas" class="mat-elevation-z0" style="width: 100%;">
          <ng-container matColumnDef="descricao">
            <th mat-header-cell *matHeaderCellDef>Descrição</th>
            <td mat-cell *matCellDef="let r">{{ r.descricao }}</td>
          </ng-container>
          <ng-container matColumnDef="criticidade">
            <th mat-header-cell *matHeaderCellDef>Criticidade</th>
            <td mat-cell *matCellDef="let r">
              <mat-chip [style.background]="criticidadeColor(r.criticidade)" style="color: #fff; font-size: 0.75rem;">
                {{ r.criticidade }}
              </mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="prazo">
            <th mat-header-cell *matHeaderCellDef>Prazo</th>
            <td mat-cell *matCellDef="let r" style="color: #c62828; font-weight: 600;">
              {{ r.prazo | date:'dd/MM/yyyy' }}
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="['descricao', 'criticidade', 'prazo']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['descricao', 'criticidade', 'prazo'];"></tr>
        </table>
      </mat-card-content>
    </mat-card>

    <!-- Card loading -->
    <div *ngIf="loading" style="display: flex; justify-content: center; padding: 2rem;">
      <mat-spinner diameter="32" />
    </div>

    <p *ngIf="error" style="color: #c62828; text-align: center; margin-top: 1rem;">{{ error }}</p>
  `,
  styles: [`
    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
    }
    .card-metric {
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
    }
    .card-label {
      text-align: center;
      color: #888;
      font-size: 0.85rem;
    }
  `],
})
export class PainelMonitoramentoComponent implements OnInit {
  recomendacoes: any[] = [];
  recomendacoesVencidas: any[] = [];
  loading = true;
  error = '';

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    this.loading = true;
    this.error = '';
    try {
      this.recomendacoes = await firstValueFrom(
        this.http.get<any[]>(`${API}/recomendacoes`),
      );
      this.recomendacoesVencidas = this.recomendacoes.filter(r => r.status === 'VENCIDA');
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar recomendações';
    } finally {
      this.loading = false;
    }
  }

  get pendentes(): number {
    return this.recomendacoes.filter(r => r.status === 'PENDENTE').length;
  }

  get emAndamento(): number {
    return this.recomendacoes.filter(r => r.status === 'EM_ANDAMENTO').length;
  }

  get cumpridas(): number {
    return this.recomendacoes.filter(r => r.status === 'CUMPRIDA').length;
  }

  get vencidas(): number {
    return this.recomendacoesVencidas.length;
  }

  criticidadeColor(criticidade: string): string {
    const m: Record<string, string> = { ALTA: '#c62828', MEDIA: '#e65100', BAIXA: '#2e7d32' };
    return m[criticidade] || '#888';
  }
}
