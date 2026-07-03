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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';
import { ToastService } from '../../core/services/toast.service';

const API = environment.apiUrl;

@Component({
  selector: 'app-risco-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatFormFieldModule,
    MatSelectModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule,
    PageHeaderComponent, DataTableComponent,
  ],
  template: `
    <app-page-header title="Gestão de Riscos" />

    <mat-card class="mb-6">
      <mat-card-content class="!p-4 bg-slate-50/30">
        <div class="flex items-center gap-3">
          <button mat-raised-button color="primary" routerLink="/riscos/novo" class="h-10 flex items-center gap-2">
            <mat-icon>add</mat-icon>
            Novo Risco
          </button>
          <div class="ml-auto flex items-center gap-2">
            <span class="text-sm text-text-sec">Visualizar:</span>
            <button mat-stroked-button [color]="exibirMatriz ? '' : 'primary'" (click)="exibirMatriz = false; carregar()">
              Lista
            </button>
            <button mat-stroked-button [color]="exibirMatriz ? 'primary' : ''" (click)="exibirMatriz = true; carregarMatriz()">
              Matriz
            </button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>

    @if (!exibirMatriz) {
      <app-data-table [data]="riscos" [displayedColumns]="colunasRiscos" [loading]="loading" [error]="error" (retry)="carregar()" emptyMessage="Nenhum risco cadastrado.">
        <ng-container matColumnDef="codigo">
          <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[120px]">Código</th>
          <td mat-cell *matCellDef="let r" class="py-3 pr-4 font-mono text-sm">{{ r.codigo }}</td>
        </ng-container>
        <ng-container matColumnDef="descricao">
          <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold text-text-main">Descrição</th>
          <td mat-cell *matCellDef="let r" class="py-3 pr-4 font-medium">
            <a [routerLink]="['/riscos', r.id]" class="text-primary hover:underline">{{ r.descricao }}</a>
          </td>
        </ng-container>
        <ng-container matColumnDef="categoria">
          <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[130px]">Categoria</th>
          <td mat-cell *matCellDef="let r" class="py-3 text-text-sec">{{ r.categoria }}</td>
        </ng-container>
        <ng-container matColumnDef="probabilidade">
          <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[80px] text-center">Prob.</th>
          <td mat-cell *matCellDef="let r" class="py-3 text-center text-text-sec">{{ r.probabilidade }}</td>
        </ng-container>
        <ng-container matColumnDef="impacto">
          <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[80px] text-center">Impacto</th>
          <td mat-cell *matCellDef="let r" class="py-3 text-center text-text-sec">{{ r.impacto }}</td>
        </ng-container>
        <ng-container matColumnDef="nivel">
          <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[100px] text-center">Nível</th>
          <td mat-cell *matCellDef="let r" class="py-3 text-center">
            <span class="px-2 py-0.5 rounded text-xs font-semibold"
              [class.bg-green-100]="r.nivel === 'BAIXO'"
              [class.text-green-700]="r.nivel === 'BAIXO'"
              [class.bg-yellow-100]="r.nivel === 'MEDIO'"
              [class.text-yellow-700]="r.nivel === 'MEDIO'"
              [class.bg-orange-100]="r.nivel === 'ALTO'"
              [class.text-orange-700]="r.nivel === 'ALTO'"
              [class.bg-red-100]="r.nivel === 'CRITICO'"
              [class.text-red-700]="r.nivel === 'CRITICO'"
              [class.bg-purple-100]="r.nivel === 'EXTREMO'"
              [class.text-purple-700]="r.nivel === 'EXTREMO'">
              {{ r.nivel }}
            </span>
          </td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[100px]">Status</th>
          <td mat-cell *matCellDef="let r" class="py-3 text-text-sec">{{ r.status }}</td>
        </ng-container>
        <ng-container matColumnDef="acoes">
          <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[100px]">Ações</th>
          <td mat-cell *matCellDef="let r" class="py-3">
            <div class="flex items-center gap-2">
              <button mat-icon-button color="primary" [routerLink]="['/riscos', r.id]" matTooltip="Editar">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="remover(r)" matTooltip="Remover">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>
      </app-data-table>
    }

    @if (exibirMatriz) {
      @if (matrizLoading) {
        <div class="flex justify-center py-12"><mat-spinner diameter="36" /></div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (entry of matriz; track entry.nivel) {
            <mat-card class="border-l-4"
              [class.border-green-500]="entry.nivel === 'BAIXO'"
              [class.border-yellow-500]="entry.nivel === 'MEDIO'"
              [class.border-orange-500]="entry.nivel === 'ALTO'"
              [class.border-red-500]="entry.nivel === 'CRITICO'"
              [class.border-purple-500]="entry.nivel === 'EXTREMO'">
              <mat-card-header>
                <mat-card-title class="text-base font-semibold">{{ entry.nivel }}</mat-card-title>
                <mat-card-subtitle>{{ entry.quantidade }} risco(s) — Score médio: {{ entry.scoreMedio }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content class="text-sm text-text-sec">
                <ul class="list-disc pl-4 mt-2 space-y-1">
                  @for (r of entry.riscos; track r.id) {
                    <li>
                      <a [routerLink]="['/riscos', r.id]" class="text-primary hover:underline">{{ r.codigo }}</a>
                      — {{ r.descricao }}
                    </li>
                  }
                </ul>
              </mat-card-content>
            </mat-card>
          }
        </div>
      }
    }
  `,
})
export class RiscoListComponent implements OnInit {
  riscos: any[] = [];
  matriz: any[] = [];
  exibirMatriz = false;
  error = '';
  loading = true;
  matrizLoading = false;
  colunasRiscos = ['codigo', 'descricao', 'categoria', 'probabilidade', 'impacto', 'nivel', 'status', 'acoes'];

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
      this.riscos = await firstValueFrom(
        this.http.get<any[]>(`${API}/riscos`),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar riscos';
    } finally {
      this.loading = false;
    }
  }

  async carregarMatriz() {
    this.matrizLoading = true;
    try {
      const res = await firstValueFrom(
        this.http.get<any[]>(`${API}/riscos/matriz`),
      );
      this.matriz = res;
    } catch {
      this.matriz = [];
    } finally {
      this.matrizLoading = false;
    }
  }

  async remover(r: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remover Risco',
        message: `Remover "${r.codigo}"?`,
        confirmText: 'Remover',
        type: 'warning',
      } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    try {
      await firstValueFrom(this.http.delete(`${API}/riscos/${r.id}`));
      this.toast.show('Risco removido', 'success');
      await this.carregar();
    } catch {
      this.toast.show('Erro ao remover risco', 'error');
    }
  }
}
