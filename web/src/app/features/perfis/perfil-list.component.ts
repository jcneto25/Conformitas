import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table.component';

@Component({
  selector: 'app-perfil-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatTableModule, MatIconModule, PageHeaderComponent, DataTableComponent],
  template: `
    <app-page-header title="Perfis (RBAC)" />

    <!-- Card Informativo -->
    <mat-card class="mb-6">
      <mat-card-content class="!p-4 bg-slate-50/30 flex items-center gap-2">
        <mat-icon class="text-primary">info</mat-icon>
        <span class="text-text-sec text-sm">
          Perfis de acesso do sistema (P01 a P10). Use o formulário de usuário para atribuir/remover perfis.
        </span>
      </mat-card-content>
    </mat-card>

    <!-- Tabela de Dados -->
    <app-data-table
      [data]="perfis"
      [displayedColumns]="columns"
      [loading]="loading"
      [error]="error"
      (retry)="ngOnInit()"
      emptyMessage="Nenhum perfil encontrado.">
        <ng-container matColumnDef="codigo">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="codigo" class="font-semibold text-text-main w-[120px]">Código</th>
          <td mat-cell *matCellDef="let p" class="py-3 font-medium text-text-main"><strong>{{ p.codigo }}</strong></td>
        </ng-container>

        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="nome" class="font-semibold text-text-main">Nome</th>
          <td mat-cell *matCellDef="let p" class="py-3 pr-4 text-text-sec">{{ p.nome }}</td>
        </ng-container>

        <ng-container matColumnDef="descricao">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="descricao" class="font-semibold text-text-main">Descrição</th>
          <td mat-cell *matCellDef="let p" class="py-3 pr-4 max-w-md truncate text-text-sec">{{ p.descricao }}</td>
        </ng-container>

        <ng-container matColumnDef="nivelAcesso">
          <th mat-header-cell *matHeaderCellDef mat-sort-header="nivelAcesso" class="font-semibold text-text-main w-[120px]">Nível Acesso</th>
          <td mat-cell *matCellDef="let p" class="py-3 text-text-sec">{{ p.nivelAcesso }}</td>
        </ng-container>
    </app-data-table>
  `,
})
export class PerfilListComponent implements OnInit {
  perfis: any[] = [];
  error = '';
  loading = true;
  columns = ['codigo', 'nome', 'descricao', 'nivelAcesso'];

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    try {
      this.loading = true;
      this.perfis = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/perfis`),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar perfis';
    } finally {
      this.loading = false;
    }
  }
}
