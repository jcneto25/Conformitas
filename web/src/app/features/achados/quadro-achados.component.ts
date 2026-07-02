import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

const API = environment.apiUrl;

@Component({
  selector: 'app-quadro-achados',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatTableModule, MatChipsModule,
    MatButtonModule, MatIconModule, MatSelectModule,
    MatFormFieldModule, MatProgressSpinnerModule, PageHeaderComponent, EmptyStateComponent,
  ],
  template: `
    <app-page-header title="Quadro de Achados" [breadcrumbs]="[{label: 'Auditoria', route: '/auditorias'}, {label: 'Achados'}]">
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
        </div>
      </mat-card-content>
    </mat-card>

    @if (loading) {
      <div class="flex justify-center py-8">
        <mat-spinner diameter="40" />
      </div>
    } @else if (error) {
      <mat-card class="border border-red-100">
        <mat-card-content class="flex items-center gap-2 text-red-600">
          <mat-icon>error_outline</mat-icon>
          <span>{{ error }}</span>
          <button mat-button color="primary" (click)="load()" class="ml-auto">Tentar novamente</button>
        </mat-card-content>
      </mat-card>
    } @else if (achados.length === 0) {
      <mat-card>
        <mat-card-content>
          <app-empty-state icon="search_off" title="Nenhum achado encontrado" description="Nenhum achado de auditoria foi registrado para esta auditoria." />
        </mat-card-content>
      </mat-card>
    } @else {
      <div class="shadow-sm rounded-xl overflow-hidden border border-gray-100 bg-white">
        <table mat-table [dataSource]="achados" class="w-full">
          <ng-container matColumnDef="codigo">
            <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[130px]">Código</th>
            <td mat-cell *matCellDef="let a" class="py-3 font-medium text-text-main">{{ a.codigo }}</td>
          </ng-container>
          <ng-container matColumnDef="tipo">
            <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main">Tipo</th>
            <td mat-cell *matCellDef="let a" class="py-3 pr-4 text-gray-700">{{ a.tipo }}</td>
          </ng-container>
          <ng-container matColumnDef="situacao">
            <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main">Situação</th>
            <td mat-cell *matCellDef="let a" class="py-3 pr-4 max-w-xs truncate text-gray-700">{{ a.situacaoEncontrada }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[140px]">Status</th>
            <td mat-cell *matCellDef="let a" class="py-3">
              <mat-chip [color]="statusChipColor(a.status)" highlighted="false" class="text-xs">
                {{ a.status }}
              </mat-chip>
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
          <tr mat-header-row *matHeaderRowDef="cols; sticky: true" class="bg-gray-50"></tr>
          <tr mat-row *matRowDef="let r; columns: cols" class="hover:bg-gray-50 transition-colors"></tr>
        </table>
      </div>
    }
  `,
})
export class QuadroAchadosComponent implements OnInit {
  cols = ['codigo', 'tipo', 'situacao', 'status', 'acoes'];
  achados: any[] = [];
  filtroStatus = '';
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
      this.achados = await firstValueFrom(
        this.http.get<any[]>(`${API}/achados`, { params }),
      );
    } catch {
      this.error = 'Erro ao carregar achados';
    } finally {
      this.loading = false;
    }
  }

  statusChipColor(s: string) {
    return s === 'PRELIMINAR' ? 'warn' : s === 'EM_MANIFESTACAO' ? 'primary' : 'accent';
  }
}
