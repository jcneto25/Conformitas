import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table.component';

@Component({
  selector: 'app-recomendacao-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, StatusBadgeComponent,
    MatCardModule, MatTableModule, MatButtonModule,
    MatFormFieldModule, MatSelectModule,
    MatIconModule, PageHeaderComponent, DataTableComponent,
  ],
  template: `
    <app-page-header title="Recomendações" />

    <mat-card class="mb-4">
      <mat-card-content>
        <form class="flex gap-4 items-end flex-wrap" (ngSubmit)="carregar()">
          <mat-form-field appearance="outline" class="min-w-[180px]">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="filtroStatus" name="status">
              <mat-option value="">Todos</mat-option>
              <mat-option value="PENDENTE">Pendente</mat-option>
              <mat-option value="EM_ANDAMENTO">Em Andamento</mat-option>
              <mat-option value="CUMPRIDA">Cumprida</mat-option>
              <mat-option value="VENCIDA">Vencida</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="min-w-[180px]">
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

    <app-data-table [data]="recomendacoes" [displayedColumns]="columns" [loading]="loading" [error]="error" (retry)="carregar()" emptyMessage="Nenhuma recomendação encontrada.">
      <ng-template #tableBody>
        <ng-container matColumnDef="descricao">
          <th mat-header-cell *matHeaderCellDef>Descrição</th>
          <td mat-cell *matCellDef="let r">{{ r.descricao }}</td>
        </ng-container>

        <ng-container matColumnDef="criticidade">
          <th mat-header-cell *matHeaderCellDef>Criticidade</th>
          <td mat-cell *matCellDef="let r">
            <app-status-badge [status]="r.criticidade" />
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let r">
            <app-status-badge [status]="r.status" />
          </td>
        </ng-container>

        <ng-container matColumnDef="prazo">
          <th mat-header-cell *matHeaderCellDef>Prazo</th>
          <td mat-cell *matCellDef="let r"
              [class]="isVencida(r) ? 'text-critical font-semibold' : ''">
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
      </ng-template>
    </app-data-table>
  `,
})
export class RecomendacaoListComponent implements OnInit {
  recomendacoes: any[] = [];
  filtroStatus = '';
  filtroCriticidade = '';
  error = '';
  loading = true;
  columns = ['descricao', 'criticidade', 'status', 'prazo', 'acoes'];

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    this.loading = true;
    this.error = '';
    try {
      const params: any = {};
      if (this.filtroStatus) params.status = this.filtroStatus;
      if (this.filtroCriticidade) params.criticidade = this.filtroCriticidade;

      this.recomendacoes = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/recomendacoes`, { params }),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar recomendações';
    } finally {
      this.loading = false;
    }
  }

  isVencida(r: any): boolean {
    if (r.status === 'VENCIDA') return true;
    if (r.prazo && new Date(r.prazo) < new Date() && r.status !== 'CUMPRIDA' && r.status !== 'CANCELADA') return true;
    return false;
  }


}
