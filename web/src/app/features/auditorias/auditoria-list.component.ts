import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table.component';
import { HasRoleDirective } from '../../core/directives/has-role.directive';

@Component({
  selector: 'app-auditoria-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, StatusBadgeComponent, PageHeaderComponent, DataTableComponent, HasRoleDirective],
  template: `
    <app-page-header title="Auditorias">
      <div actions>
        <button mat-raised-button color="primary" [routerLink]="['/auditorias/novo']" *appHasRole="'P01'" class="flex items-center gap-2">
          <mat-icon>add</mat-icon>
          Abrir Auditoria
        </button>
      </div>
    </app-page-header>

    <!-- Card Informativo -->
    <mat-card class="mb-6">
      <mat-card-content class="!p-4 bg-slate-50/30 flex items-center gap-2">
        <mat-icon class="text-primary">info</mat-icon>
        <span class="text-text-sec text-sm">Listagem de auditorias. Somente o perfil P01 pode abrir novas auditorias.</span>
      </mat-card-content>
    </mat-card>

    <!-- Tabela de Dados (lista de auditorias) -->
    <app-data-table
      [data]="auditorias"
      [displayedColumns]="columns"
      [loading]="loading"
      [error]="error"
      (retry)="ngOnInit()"
      emptyMessage="Nenhuma auditoria encontrada."
      emptyActionLabel="Nova Auditoria"
      (emptyAction)="novaAuditoria()">
        <ng-container matColumnDef="codigo">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="codigo" class="font-semibold text-text-main w-[130px]">Código</th>
          <td mat-cell *matCellDef="let a" class="py-3 font-medium text-text-main">{{ a.codigo || a.id?.slice(0, 8) }}</td>
        </ng-container>

        <ng-container matColumnDef="unidadeAuditada">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="unidadeAuditada" class="font-semibold text-text-main">Unidade Auditada</th>
          <td mat-cell *matCellDef="let a" class="py-3 pr-4">{{ a.unidadeAuditada }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="status" class="font-semibold text-text-main w-[140px]">Status</th>
          <td mat-cell *matCellDef="let a" class="py-3">
            <app-status-badge [status]="a.status" />
          </td>
        </ng-container>

        <ng-container matColumnDef="createdAt">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="createdAt" class="font-semibold text-text-main w-[120px]">Data de Abertura</th>
          <td mat-cell *matCellDef="let a" class="py-3 text-text-sec">{{ a.createdAt | date:'dd/MM/yyyy' }}</td>
        </ng-container>

        <ng-container matColumnDef="acoes">
          <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[130px]">Ações</th>
          <td mat-cell *matCellDef="let a" class="py-3">
            <button mat-stroked-button color="primary" [routerLink]="['/auditorias', a.id]" class="flex items-center gap-1">
              <mat-icon class="text-[18px] w-[18px] h-[18px]">visibility</mat-icon> Ver Detalhes
            </button>
          </td>
        </ng-container>
    </app-data-table>
  `,
})
export class AuditoriaListComponent implements OnInit {
  auditorias: any[] = [];
  error = '';
  loading = true;
  columns = ['codigo', 'unidadeAuditada', 'status', 'createdAt', 'acoes'];

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  novaAuditoria(): void {
    this.router.navigate(['/auditorias/novo']);
  }

  async ngOnInit() {
    try {
      this.auditorias = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/auditorias`),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar auditorias';
    } finally {
      this.loading = false;
    }
  }


}
