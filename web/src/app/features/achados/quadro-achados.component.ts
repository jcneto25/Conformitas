import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table.component';

const API = environment.apiUrl;

@Component({
  selector: 'app-quadro-achados',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule, MatSelectModule,
    MatFormFieldModule, FormsModule, RouterModule,
    PageHeaderComponent, StatusBadgeComponent, DataTableComponent,
  ],
  template: `
    <app-page-header title="Quadro de Achados">
      <div actions>
        <button mat-raised-button color="primary" routerLink="/achados/novo" class="flex items-center gap-2">
          <mat-icon>add</mat-icon> Novo Achado
        </button>
      </div>
    </app-page-header>

    <!-- Card Informativo / Filtro -->
    <mat-card class="mb-6 border-l-4 border-primary shadow-sm rounded-r-xl overflow-hidden">
      <mat-card-content class="p-4 bg-slate-50/30">
        <div class="filter-bar gap-4 items-center">
          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="min-w-[200px]">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="filtroStatus" (selectionChange)="load()">
              <mat-option value="">Todos</mat-option>
              <mat-option value="PRELIMINAR">Preliminar</mat-option>
              <mat-option value="EM_MANIFESTACAO">Em Manifestação</mat-option>
              <mat-option value="CONSOLIDADO">Consolidado</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="min-w-[200px]">
            <mat-label>Tipo</mat-label>
            <mat-select [(ngModel)]="filtroTipo" (selectionChange)="load()">
              <mat-option value="">Todos</mat-option>
              <mat-option value="POSITIVO">Positivo</mat-option>
              <mat-option value="NEGATIVO">Negativo</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card-content>
    </mat-card>

    @if (loading) {
      <div class="flex justify-center py-8">
        <mat-spinner diameter="40" />
      </div>
    } @else {
      <app-data-table [data]="achados" [displayedColumns]="cols" [loading]="false" [error]="error" (retry)="load()" emptyMessage="Nenhum achado encontrado.">
        <ng-container matColumnDef="codigo">
          <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold text-text-main w-[130px]">Código</th>
          <td mat-cell *matCellDef="let a" class="py-3 font-medium text-text-main">{{ a.codigo }}</td>
        </ng-container>
        <ng-container matColumnDef="tipo">
          <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main">Tipo</th>
          <td mat-cell *matCellDef="let a" class="py-3 pr-4 text-text-sec">{{ a.tipo }}</td>
        </ng-container>
        <ng-container matColumnDef="situacao">
          <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main">Situação</th>
          <td mat-cell *matCellDef="let a" class="py-3 pr-4 max-w-xs truncate text-text-sec">{{ a.situacaoEncontrada }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[140px]">Status</th>
          <td mat-cell *matCellDef="let a" class="py-3">
            <app-status-badge [status]="a.status" />
          </td>
        </ng-container>
        <ng-container matColumnDef="acoes">
          <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[100px]"></th>
          <td mat-cell *matCellDef="let a" class="py-3">
            <button mat-icon-button [routerLink]="['/achados', a.id]" matTooltip="Visualizar" aria-label="Visualizar achado">
              <mat-icon>visibility</mat-icon>
            </button>
          </td>
        </ng-container>
      </app-data-table>
    }
  `,
})
export class QuadroAchadosComponent implements OnInit {
  cols = ['codigo', 'tipo', 'situacao', 'status', 'acoes'];
  achados: any[] = [];
  filtroStatus = '';
  filtroTipo = '';
  loading = false;
  error = '';

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    this.error = '';
    try {
      const params: any = {};
      if (this.filtroStatus) params.status = this.filtroStatus;
      if (this.filtroTipo) params.tipo = this.filtroTipo;
      this.achados = await firstValueFrom(
        this.http.get<any[]>(`${API}/achados`, { params }),
      );
    } catch {
      this.error = 'Erro ao carregar achados';
    } finally {
      this.loading = false;
    }
  }
}
