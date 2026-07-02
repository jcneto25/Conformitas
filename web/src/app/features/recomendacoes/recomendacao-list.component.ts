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

    <!-- Card de Filtros -->
    <mat-card class="mb-6">
      <mat-card-content class="!p-4 bg-slate-50/30">
        <form class="filter-bar" (ngSubmit)="carregar()">
          <mat-form-field appearance="outline" class="min-w-[220px]">
            <mat-label>Status da Recomendação</mat-label>
            <mat-select [(ngModel)]="filtroStatus" name="status">
              <mat-option value="">Todos os Status</mat-option>
              <mat-option value="PENDENTE">Pendente</mat-option>
              <mat-option value="EM_ANDAMENTO">Em Andamento</mat-option>
              <mat-option value="CUMPRIDA">Cumprida</mat-option>
              <mat-option value="VENCIDA">Vencida</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="min-w-[220px]">
            <mat-label>Criticidade</mat-label>
            <mat-select [(ngModel)]="filtroCriticidade" name="criticidade">
              <mat-option value="">Todas as Criticidades</mat-option>
              <mat-option value="ALTA">Alta</mat-option>
              <mat-option value="MEDIA">Média</mat-option>
              <mat-option value="BAIXA">Baixa</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" class="h-14 flex items-center gap-2 px-5">
            <mat-icon>search</mat-icon>
            Filtrar
          </button>
        </form>
      </mat-card-content>
    </mat-card>

    <!-- Tabela de Dados -->
    <app-data-table [data]="recomendacoes" [displayedColumns]="columns" [loading]="loading" [error]="error" (retry)="carregar()" emptyMessage="Nenhuma recomendação encontrada para os filtros selecionados.">
        <ng-container matColumnDef="descricao">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="descricao" class="font-semibold text-text-main">Descrição da Recomendação</th>
          <td mat-cell *matCellDef="let r" class="py-3 pr-4 max-w-md truncate" [title]="r.descricao">{{ r.descricao }}</td>
        </ng-container>

        <ng-container matColumnDef="criticidade">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="criticidade" class="font-semibold text-text-main w-[140px]">Criticidade</th>
          <td mat-cell *matCellDef="let r" class="py-3">
            <app-status-badge [status]="r.criticidade" />
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="status" class="font-semibold text-text-main w-[140px]">Status</th>
          <td mat-cell *matCellDef="let r" class="py-3">
            <app-status-badge [status]="r.status" />
          </td>
        </ng-container>

        <ng-container matColumnDef="prazo">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="prazo" class="font-semibold text-text-main w-[120px]">Prazo</th>
          <td mat-cell *matCellDef="let r" class="py-3"
              [class]="isVencida(r) ? 'text-critical font-semibold' : 'text-gray-700'">
            {{ r.prazo | date:'dd/MM/yyyy' }}
          </td>
        </ng-container>

        <ng-container matColumnDef="acoes">
          <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[100px]">Ações</th>
          <td mat-cell *matCellDef="let r" class="py-3">
            <button mat-stroked-button color="primary" [routerLink]="['/recomendacoes', r.id]" class="flex items-center gap-1">
              <mat-icon class="text-[18px] w-[18px] h-[18px]">visibility</mat-icon> Ver Detalhes
            </button>
          </td>
        </ng-container>
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
