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
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';
import { KpiCardComponent } from '../../shared/components/kpi-card.component';
import { ToastService } from '../../core/services/toast.service';

const API = environment.apiUrl;

@Component({
  selector: 'app-capacitacao-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule, MatDialogModule,
    PageHeaderComponent, DataTableComponent, KpiCardComponent,
  ],
  template: `
    <app-page-header title="Capacitações (PAC-Aud)" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <app-kpi-card
        label="Total de Horas (Ano)"
        [value]="totalHoras"
        icon="schedule"
        accent="primary"
      />
      <app-kpi-card
        label="Meta Anual"
        [value]="'40h'"
        icon="flag"
        accent="info"
      />
      <app-kpi-card
        label="Faltam para Meta"
        [value]="faltam + 'h'"
        icon="trending_up"
        [accent]="faltam > 0 ? 'warning' : 'success'"
      />
    </div>

    <div class="flex items-center gap-3 mb-4">
      <button mat-raised-button color="primary" routerLink="/capacitacoes/novo" class="h-10 flex items-center gap-2">
        <mat-icon>add</mat-icon>
        Nova Capacitação
      </button>
    </div>

    <app-data-table [data]="capacitacoes" [displayedColumns]="colunas" [loading]="loading" [error]="error" (retry)="carregar()" emptyMessage="Nenhuma capacitação cadastrada.">
      <ng-container matColumnDef="titulo">
        <th mat-header-cell *matHeaderCellDef mat-sort-header class="font-semibold text-text-main">Título</th>
        <td mat-cell *matCellDef="let c" class="py-3 pr-4 font-medium">
          <a [routerLink]="['/capacitacoes', c.id]" class="text-primary hover:underline">{{ c.titulo }}</a>
        </td>
      </ng-container>
      <ng-container matColumnDef="instituicao">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[140px]">Instituição</th>
        <td mat-cell *matCellDef="let c" class="py-3 text-text-sec">{{ c.instituicao }}</td>
      </ng-container>
      <ng-container matColumnDef="cargaHoraria">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[80px] text-center">Carga H.</th>
        <td mat-cell *matCellDef="let c" class="py-3 text-center text-text-sec">{{ c.cargaHoraria }}h</td>
      </ng-container>
      <ng-container matColumnDef="tipo">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[100px]">Tipo</th>
        <td mat-cell *matCellDef="let c" class="py-3 text-text-sec">{{ c.tipo }}</td>
      </ng-container>
      <ng-container matColumnDef="dataInicio">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[100px]">Início</th>
        <td mat-cell *matCellDef="let c" class="py-3 text-text-sec">{{ c.dataInicio | date:'dd/MM/yyyy' }}</td>
      </ng-container>
      <ng-container matColumnDef="acoes">
        <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[100px]">Ações</th>
        <td mat-cell *matCellDef="let c" class="py-3">
          <div class="flex items-center gap-2">
            <button mat-icon-button color="primary" [routerLink]="['/capacitacoes', c.id]" matTooltip="Editar">
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
export class CapacitacaoListComponent implements OnInit {
  capacitacoes: any[] = [];
  totalHoras = 0;
  faltam = 40;
  error = '';
  loading = true;
  colunas = ['titulo', 'instituicao', 'cargaHoraria', 'tipo', 'dataInicio', 'acoes'];

  constructor(
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
    private readonly toast: ToastService,
  ) {}

  async ngOnInit() {
    await this.carregar();
    await this.carregarTotalizacao();
  }

  async carregar() {
    this.loading = true;
    this.error = '';
    try {
      this.capacitacoes = await firstValueFrom(
        this.http.get<any[]>(`${API}/capacitacoes`),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar capacitações';
    } finally {
      this.loading = false;
    }
  }

  async carregarTotalizacao() {
    try {
      const res = await firstValueFrom(
        this.http.get<any>(`${API}/capacitacoes/totalizacao`),
      );
      this.totalHoras = res.totalHoras || 0;
    } catch {
      this.totalHoras = 0;
    }
    try {
      const alerta = await firstValueFrom(
        this.http.get<any>(`${API}/capacitacoes/alerta-meta`),
      );
      this.faltam = alerta.faltam || 40;
    } catch {
      this.faltam = 40;
    }
  }

  async remover(c: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remover Capacitação',
        message: `Remover "${c.titulo}"?`,
        confirmText: 'Remover',
        type: 'warning',
      } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    try {
      await firstValueFrom(this.http.delete(`${API}/capacitacoes/${c.id}`));
      this.toast.show('Capacitação removida', 'success');
      await this.carregar();
      await this.carregarTotalizacao();
    } catch {
      this.toast.show('Erro ao remover capacitação', 'error');
    }
  }
}
