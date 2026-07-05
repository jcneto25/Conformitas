import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';
import { ToastService } from '../../core/services/toast.service';

const API = environment.apiUrl;

@Component({
  selector: 'app-competencia-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatChipsModule,
    PageHeaderComponent, DataTableComponent,
  ],
  template: `
    <app-page-header title="Competências" />

    <div class="flex items-center gap-3 mb-4">
      <button mat-raised-button color="primary" routerLink="/competencias/novo" class="h-10 flex items-center gap-2">
        <mat-icon>add</mat-icon>
        Nova Competência
      </button>
    </div>

    <app-data-table [data]="competencias" [displayedColumns]="colunas" [loading]="loading" [error]="error" (retry)="carregar()" emptyMessage="Nenhuma competência cadastrada.">
      <ng-container matColumnDef="codigo">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[110px]">Código</th>
        <td mat-cell *matCellDef="let c" class="py-3 font-mono text-sm">{{ c.codigo }}</td>
      </ng-container>
      <ng-container matColumnDef="nome">
        <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold text-text-main">Nome</th>
        <td mat-cell *matCellDef="let c" class="py-3 pr-4 font-medium">
          <a [routerLink]="['/competencias', c.id]" class="text-primary hover:underline">{{ c.nome }}</a>
        </td>
      </ng-container>
      <ng-container matColumnDef="categoria">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[130px]">Categoria</th>
        <td mat-cell *matCellDef="let c" class="py-3"><mat-chip class="!h-6 text-xs">{{ c.categoria }}</mat-chip></td>
      </ng-container>
      <ng-container matColumnDef="nivelEsperado">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[120px]">Nível Esperado</th>
        <td mat-cell *matCellDef="let c" class="py-3 text-text-sec">{{ c.nivelEsperado }}</td>
      </ng-container>
      <ng-container matColumnDef="acoes">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[100px]">Ações</th>
        <td mat-cell *matCellDef="let c" class="py-3">
          <div class="flex items-center gap-2">
            <button mat-icon-button color="primary" [routerLink]="['/competencias', c.id]" matTooltip="Editar">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="remover(c)" matTooltip="Remover">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </td>
      </ng-container>
    </app-data-table>
  `,
})
export class CompetenciaListComponent implements OnInit {
  competencias: any[] = [];
  error = '';
  loading = true;
  colunas = ['codigo', 'nome', 'categoria', 'nivelEsperado', 'acoes'];

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
      this.competencias = await firstValueFrom(
        this.http.get<any[]>(`${API}/competencias`),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar competências';
    } finally {
      this.loading = false;
    }
  }

  async remover(c: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remover Competência',
        message: `Remover "${c.nome}"?`,
        confirmText: 'Remover',
        type: 'warning',
      } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    try {
      await firstValueFrom(this.http.delete(`${API}/competencias/${c.id}`));
      this.toast.show('Competência removida', 'success');
      await this.carregar();
    } catch {
      this.toast.show('Erro ao remover competência', 'error');
    }
  }
}
