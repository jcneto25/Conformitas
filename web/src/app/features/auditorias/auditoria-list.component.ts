import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table.component';
import { HasRoleDirective } from '../../core/directives/has-role.directive';

@Component({
  selector: 'app-auditoria-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, StatusBadgeComponent, PageHeaderComponent, DataTableComponent, HasRoleDirective],
  template: `
    <app-page-header title="Auditorias">
      <div actions>
        <button mat-raised-button color="primary" [routerLink]="['/auditorias/novo']" *appHasRole="'P01'">
          Abrir Auditoria
        </button>
      </div>
    </app-page-header>

    <mat-card class="mb-4">
      <mat-card-content>
        <span class="text-text-sec">Listagem de auditorias. Somente P01 pode abrir novas auditorias.</span>
      </mat-card-content>
    </mat-card>

    <app-data-table
      [data]="auditorias"
      [displayedColumns]="columns"
      [loading]="loading"
      [error]="error"
      (retry)="ngOnInit()"
      emptyMessage="Nenhuma auditoria encontrada.">
      <ng-template #tableBody>
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
            <app-status-badge [status]="a.status" />
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
      </ng-template>
    </app-data-table>
  `,
})
export class AuditoriaListComponent implements OnInit {
  auditorias: any[] = [];
  error = '';
  loading = true;
  columns = ['codigo', 'unidadeAuditada', 'status', 'createdAt', 'acoes'];

  constructor(private readonly http: HttpClient) {}

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
