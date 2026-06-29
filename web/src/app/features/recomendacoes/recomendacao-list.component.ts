import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-recomendacao-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatTableModule, MatButtonModule, MatChipsModule,
    MatFormFieldModule, MatSelectModule, MatInputModule,
    MatIconModule, MatDividerModule,
  ],
  template: `
    <h1>Recomendações</h1>

    <!-- Filtros -->
    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content>
        <form style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;" (ngSubmit)="carregar()">
          <mat-form-field appearance="outline" style="min-width: 180px;">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="filtroStatus" name="status">
              <mat-option value="">Todos</mat-option>
              <mat-option value="PENDENTE">Pendente</mat-option>
              <mat-option value="EM_ANDAMENTO">Em Andamento</mat-option>
              <mat-option value="CUMPRIDA">Cumprida</mat-option>
              <mat-option value="VENCIDA">Vencida</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" style="min-width: 180px;">
            <mat-label>Criticidade</mat-label>
            <mat-select [(ngModel)]="filtroCriticidade" name="criticidade">
              <mat-option value="">Todas</mat-option>
              <mat-option value="ALTA">Alta</mat-option>
              <mat-option value="MEDIA">Média</mat-option>
              <mat-option value="BAIXA">Baixa</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit">Filtrar</button>
        </form>
      </mat-card-content>
    </mat-card>

    <!-- Tabela -->
    <mat-card>
      <mat-card-content>
        <table mat-table [dataSource]="recomendacoes" class="mat-elevation-z0" style="width: 100%;">
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

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let r">
              <mat-chip [style.background]="statusColor(r.status)" style="color: #fff; font-size: 0.75rem;">
                {{ r.status }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="prazo">
            <th mat-header-cell *matHeaderCellDef>Prazo</th>
            <td mat-cell *matCellDef="let r" [style.color]="isVencida(r) ? '#c62828' : 'inherit'"
                [style.fontWeight]="isVencida(r) ? '600' : '400'">
              {{ r.prazo | date:'dd/MM/yyyy' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let r">
              <button mat-stroked-button [routerLink]="['/recomendacoes', r.id]">
                <mat-icon>visibility</mat-icon> Ver
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>

        <p *ngIf="!recomendacoes.length && !error" style="text-align: center; color: #999; padding: 2rem;">
          Nenhuma recomendação encontrada.
        </p>
        <p *ngIf="error" style="color: #c62828; text-align: center;">{{ error }}</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class RecomendacaoListComponent implements OnInit {
  recomendacoes: any[] = [];
  filtroStatus = '';
  filtroCriticidade = '';
  error = '';
  columns = ['descricao', 'criticidade', 'status', 'prazo', 'acoes'];

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    this.error = '';
    try {
      const params: any = {};
      if (this.filtroStatus) params.status = this.filtroStatus;
      if (this.filtroCriticidade) params.criticidade = this.filtroCriticidade;

      this.recomendacoes = await firstValueFrom(
        this.http.get<any[]>(`${API}/recomendacoes`, { params }),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar recomendações';
    }
  }

  isVencida(r: any): boolean {
    if (r.status === 'VENCIDA') return true;
    if (r.prazo && new Date(r.prazo) < new Date() && r.status !== 'CUMPRIDA' && r.status !== 'CANCELADA') return true;
    return false;
  }

  criticidadeColor(criticidade: string): string {
    const m: Record<string, string> = { ALTA: '#c62828', MEDIA: '#e65100', BAIXA: '#2e7d32' };
    return m[criticidade] || '#888';
  }

  statusColor(status: string): string {
    const m: Record<string, string> = {
      PENDENTE: '#1565c0',
      EM_ANDAMENTO: '#e65100',
      CUMPRIDA: '#2e7d32',
      VENCIDA: '#c62828',
      CANCELADA: '#888',
    };
    return m[status] || '#888';
  }
}
