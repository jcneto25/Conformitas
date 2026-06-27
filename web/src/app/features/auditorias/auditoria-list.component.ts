import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-auditoria-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatCardModule, MatChipsModule],
  template: `
    <h1>Auditorias</h1>

    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content style="display: flex; justify-content: space-between; align-items: center;">
        <span style="color: #666;">Listagem de auditorias. Somente P01 pode abrir novas auditorias.</span>
        <button mat-raised-button color="primary" [routerLink]="['/auditorias/novo']">
          Abrir Auditoria
        </button>
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-content>
        <table mat-table [dataSource]="auditorias" class="mat-elevation-z0" style="width: 100%;">
          <ng-container matColumnDef="codigo">
            <th mat-header-cell *matHeaderCellDef>Código</th>
            <td mat-cell *matCellDef="let a">{{ a.codigo || a.id?.slice(0, 8) }}</td>
          </ng-container>

          <ng-container matColumnDef="unidadeAuditada">
            <th mat-header-cell *matHeaderCellDef>Unidade</th>
            <td mat-cell *matCellDef="let a">{{ a.unidadeAuditada }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let a">
              <mat-chip [style.background]="statusColor(a.status)" style="color: #fff; font-size: 0.75rem;">
                {{ a.status }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef>Data</th>
            <td mat-cell *matCellDef="let a">{{ a.createdAt | date:'dd/MM/yyyy' }}</td>
          </ng-container>

          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let a">
              <button mat-stroked-button [routerLink]="['/auditorias', a.id]">
                Ver
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>

        <p *ngIf="!auditorias.length && !error" style="text-align: center; color: #999; padding: 2rem;">
          Nenhuma auditoria encontrada.
        </p>
        <p *ngIf="error" style="color: #c62828; text-align: center;">{{ error }}</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class AuditoriaListComponent implements OnInit {
  auditorias: any[] = [];
  error = '';
  columns = ['codigo', 'unidadeAuditada', 'status', 'createdAt', 'acoes'];

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    try {
      this.auditorias = await firstValueFrom(
        this.http.get<any[]>(`${API}/auditorias`),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar auditorias';
    }
  }

  statusColor(status: string): string {
    const m: Record<string, string> = {
      ABERTA: '#1565c0',
      EM_EXECUCAO: '#e65100',
      SUSPENSA: '#c62828',
      CONCLUIDA: '#2e7d32',
    };
    return m[status] || '#666';
  }
}
