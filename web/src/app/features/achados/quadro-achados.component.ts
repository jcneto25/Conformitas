import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-quadro-achados',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatTableModule, MatChipsModule,
    MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule,
  ],
  template: `
    <h1>Quadro de Achados</h1>

    <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
      <mat-form-field appearance="outline" style="width: 200px;">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="filtroStatus" (selectionChange)="load()">
          <mat-option value="">Todos</mat-option>
          <mat-option value="PRELIMINAR">Preliminar</mat-option>
          <mat-option value="EM_MANIFESTACAO">Em Manifestação</mat-option>
          <mat-option value="CONSOLIDADO">Consolidado</mat-option>
        </mat-select>
      </mat-form-field>

      <button mat-raised-button color="primary" routerLink="/achados/novo">
        <mat-icon>add</mat-icon> Novo Achado
      </button>
    </div>

    <mat-card>
      <mat-card-content>
        <table mat-table [dataSource]="achados" class="full-width">
          <ng-container matColumnDef="codigo">
            <th mat-header-cell *matHeaderCellDef>Código</th>
            <td mat-cell *matCellDef="let a">{{ a.codigo }}</td>
          </ng-container>

          <ng-container matColumnDef="tipo">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let a">{{ a.tipo }}</td>
          </ng-container>

          <ng-container matColumnDef="situacao">
            <th mat-header-cell *matHeaderCellDef>Situação Encontrada</th>
            <td mat-cell *matCellDef="let a" style="max-width: 300px;">{{ a.situacaoEncontrada }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let a">
              <span [style.color]="statusColor(a.status)">{{ a.status }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let a">
              <button mat-icon-button [routerLink]="['/achados', a.id]">
                <mat-icon>visibility</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let r; columns: cols"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: ['.full-width { width: 100%; }']
})
export class QuadroAchadosComponent implements OnInit {
  cols = ['codigo', 'tipo', 'situacao', 'status', 'acoes'];
  achados: any[] = [];
  filtroStatus = '';

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    const params: any = {};
    if (this.filtroStatus) params.status = this.filtroStatus;
    this.achados = await firstValueFrom(
      this.http.get<any[]>(`${API}/achados`, { params }),
    );
  }

  statusColor(s: string) {
    return s === 'PRELIMINAR' ? '#e65100' : s === 'EM_MANIFESTACAO' ? '#1565c0' : '#2e7d32';
  }
}
