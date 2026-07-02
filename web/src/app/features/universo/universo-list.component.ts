import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';
import { ToastService } from '../../core/services/toast.service';

const API = environment.apiUrl;

@Component({
  selector: 'app-universo-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatFormFieldModule,
    MatSelectModule, MatIconModule, MatDialogModule,
    PageHeaderComponent, DataTableComponent,
  ],
  template: `
    <app-page-header title="Universo Auditável" />

    <mat-card class="mb-6">
      <mat-card-content class="!p-4 bg-slate-50/30">
        <form class="filter-bar" (ngSubmit)="carregar()">
          <mat-form-field appearance="outline" class="min-w-[220px]">
            <mat-label>Tipo</mat-label>
            <mat-select [(ngModel)]="filtroTipo" name="tipo">
              <mat-option value="">Todos os Tipos</mat-option>
              <mat-option value="AREA">Área</mat-option>
              <mat-option value="PROCESSO">Processo</mat-option>
              <mat-option value="TEMA">Tema</mat-option>
              <mat-option value="PROJETO">Projeto</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" class="h-14 flex items-center gap-2 px-5">
            <mat-icon>search</mat-icon>
            Filtrar
          </button>
          <button mat-stroked-button color="primary" type="button" routerLink="/universo/novo" class="h-14 flex items-center gap-2 px-5 ml-auto">
            <mat-icon>add</mat-icon>
            Novo Item
          </button>
        </form>
      </mat-card-content>
    </mat-card>

    <app-data-table [data]="itens" [displayedColumns]="columns" [loading]="loading" [error]="error" (retry)="carregar()" emptyMessage="Nenhum item no universo auditável.">
      <ng-container matColumnDef="nome">
        <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold text-text-main">Nome</th>
        <td mat-cell *matCellDef="let i" class="py-3 pr-4 font-medium text-text-main">
          <a [routerLink]="['/universo', i.id]" class="text-primary hover:underline">{{ i.nome }}</a>
        </td>
      </ng-container>

      <ng-container matColumnDef="tipo">
        <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold text-text-main w-[120px]">Tipo</th>
        <td mat-cell *matCellDef="let i" class="py-3 text-text-sec">{{ i.tipo }}</td>
      </ng-container>

      <ng-container matColumnDef="unidadeResponsavel">
        <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold text-text-main w-[140px]">Unidade</th>
        <td mat-cell *matCellDef="let i" class="py-3 text-text-sec">{{ i.unidadeResponsavel }}</td>
      </ng-container>

      <ng-container matColumnDef="materialidade">
        <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold text-text-main w-[70px] text-center">Mat.</th>
        <td mat-cell *matCellDef="let i" class="py-3 text-center text-text-sec">{{ i.materialidade }}</td>
      </ng-container>

      <ng-container matColumnDef="relevancia">
        <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold text-text-main w-[70px] text-center">Rev.</th>
        <td mat-cell *matCellDef="let i" class="py-3 text-center text-text-sec">{{ i.relevancia }}</td>
      </ng-container>

      <ng-container matColumnDef="criticidade">
        <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold text-text-main w-[70px] text-center">Crit.</th>
        <td mat-cell *matCellDef="let i" class="py-3 text-center text-text-sec">{{ i.criticidade }}</td>
      </ng-container>

      <ng-container matColumnDef="risco">
        <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold text-text-main w-[70px] text-center">Risco</th>
        <td mat-cell *matCellDef="let i" class="py-3 text-center text-text-sec">{{ i.risco }}</td>
      </ng-container>

      <ng-container matColumnDef="indicePriorizacao">
        <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold text-text-main w-[100px] text-center">Índice</th>
        <td mat-cell *matCellDef="let i" class="py-3 text-center font-semibold text-primary-dark">{{ i.indicePriorizacao | number:'1.2-2' }}</td>
      </ng-container>

      <ng-container matColumnDef="acoes">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[120px]">Ações</th>
        <td mat-cell *matCellDef="let i" class="py-3">
          <div class="flex items-center gap-2">
            <button mat-icon-button color="primary" [routerLink]="['/universo', i.id]"
                    matTooltip="Editar" aria-label="Editar item">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="remover(i)"
                    matTooltip="Remover" aria-label="Remover item">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </td>
      </ng-container>
    </app-data-table>
  `,
})
export class UniversoListComponent implements OnInit {
  itens: any[] = [];
  filtroTipo = '';
  error = '';
  loading = true;
  columns = ['nome', 'tipo', 'unidadeResponsavel', 'materialidade', 'relevancia', 'criticidade', 'risco', 'indicePriorizacao', 'acoes'];

  constructor(
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
    private readonly toast: ToastService,
  ) {}

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    this.loading = true;
    this.error = '';
    try {
      const params: any = {};
      if (this.filtroTipo) params.tipo = this.filtroTipo;
      this.itens = await firstValueFrom(
        this.http.get<any[]>(`${API}/universo-auditavel`, { params }),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar universo auditável';
    } finally {
      this.loading = false;
    }
  }

  async remover(item: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remover Item',
        message: `Remover "${item.nome}" do universo auditável?`,
        confirmText: 'Remover',
        type: 'warning',
      } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    try {
      await firstValueFrom(this.http.delete(`${API}/universo-auditavel/${item.id}`));
      this.toast.show('Item removido do universo auditável', 'success');
      await this.carregar();
    } catch {
      this.toast.show('Erro ao remover item', 'error');
    }
  }
}
