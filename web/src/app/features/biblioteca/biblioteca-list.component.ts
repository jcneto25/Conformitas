import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';
import { ToastService } from '../../core/services/toast.service';

const API = environment.apiUrl;

@Component({
  selector: 'app-biblioteca-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatIconModule, MatDialogModule, MatChipsModule, MatTooltipModule,
    PageHeaderComponent, DataTableComponent,
  ],
  template: `
    <app-page-header title="Biblioteca de Documentos" />

    <mat-card class="mb-6">
      <mat-card-content class="!p-4 bg-slate-50/30">
        <form class="filter-bar" (ngSubmit)="buscar()">
          <mat-form-field appearance="outline" class="min-w-[250px]">
            <mat-icon matIconPrefix>search</mat-icon>
            <mat-label>Buscar documentos</mat-label>
            <input matInput [(ngModel)]="searchQuery" name="search" placeholder="Título ou categoria..." />
          </mat-form-field>
          <mat-form-field appearance="outline" class="min-w-[180px]">
            <mat-label>Categoria</mat-label>
            <mat-select [(ngModel)]="filtroCategoria" name="categoria">
              <mat-option value="">Todas</mat-option>
              <mat-option value="MANUAL">Manual</mat-option>
              <mat-option value="PROGRAMA">Programa</mat-option>
              <mat-option value="GUIA">Guia</mat-option>
              <mat-option value="POLITICA">Política</mat-option>
              <mat-option value="FORMULARIO">Formulário</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" class="h-14 flex items-center gap-2 px-5">
            <mat-icon>search</mat-icon>
            Filtrar
          </button>
          <button mat-stroked-button color="primary" type="button" routerLink="/biblioteca/novo" class="h-14 flex items-center gap-2 ml-auto">
            <mat-icon>add</mat-icon>
            Novo Documento
          </button>
        </form>
      </mat-card-content>
    </mat-card>

    <app-data-table [data]="documentos" [displayedColumns]="colunas" [loading]="loading" [error]="error" (retry)="carregar()" emptyMessage="Nenhum documento encontrado.">
      <ng-container matColumnDef="titulo">
        <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold text-text-main">Título</th>
        <td mat-cell *matCellDef="let d" class="py-3 pr-4 font-medium">
          <a [routerLink]="['/biblioteca', d.id]" class="text-primary hover:underline">{{ d.titulo }}</a>
        </td>
      </ng-container>
      <ng-container matColumnDef="categoria">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[110px]">Categoria</th>
        <td mat-cell *matCellDef="let d" class="py-3"><mat-chip class="!h-6 text-xs">{{ d.categoria }}</mat-chip></td>
      </ng-container>
      <ng-container matColumnDef="versao">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[70px] text-center">Versão</th>
        <td mat-cell *matCellDef="let d" class="py-3 text-center font-mono text-sm">v{{ d.versao }}</td>
      </ng-container>
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[100px]">Status</th>
        <td mat-cell *matCellDef="let d" class="py-3">
          <span class="px-2 py-0.5 rounded text-xs font-semibold"
            [class.bg-green-100]="d.status === 'PUBLICADO'"
            [class.text-green-700]="d.status === 'PUBLICADO'"
            [class.bg-yellow-100]="d.status === 'RASCUNHO'"
            [class.text-yellow-700]="d.status === 'RASCUNHO'"
            [class.bg-gray-100]="d.status === 'ARQUIVADO'"
            [class.text-gray-600]="d.status === 'ARQUIVADO'">
            {{ d.status }}
          </span>
        </td>
      </ng-container>
      <ng-container matColumnDef="acoes">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[120px]">Ações</th>
        <td mat-cell *matCellDef="let d" class="py-3">
          <div class="flex items-center gap-2">
            <button mat-icon-button color="primary" [routerLink]="['/biblioteca', d.id]" matTooltip="Editar">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="remover(d)" matTooltip="Remover">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </td>
      </ng-container>
    </app-data-table>
  `,
})
export class BibliotecaListComponent implements OnInit {
  documentos: any[] = [];
  searchQuery = '';
  filtroCategoria = '';
  error = '';
  loading = true;
  colunas = ['titulo', 'categoria', 'versao', 'status', 'acoes'];

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
      if (this.searchQuery) params.search = this.searchQuery;
      if (this.filtroCategoria) params.categoria = this.filtroCategoria;
      this.documentos = await firstValueFrom(
        this.http.get<any[]>(`${API}/documentos-metodologicos`, { params }),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar documentos';
    } finally {
      this.loading = false;
    }
  }

  async buscar() {
    await this.carregar();
  }

  async remover(d: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Arquivar Documento',
        message: `Arquivar "${d.titulo}" (v${d.versao})?`,
        confirmText: 'Arquivar',
        type: 'warning',
      } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    try {
      await firstValueFrom(this.http.delete(`${API}/documentos-metodologicos/${d.id}`));
      this.toast.show('Documento arquivado', 'success');
      await this.carregar();
    } catch {
      this.toast.show('Erro ao arquivar documento', 'error');
    }
  }
}
