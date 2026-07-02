import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { HasRoleDirective } from '../../core/directives/has-role.directive';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-plano-aprovacao',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, StatusBadgeComponent, MatDialogModule,
    MatCardModule, MatButtonModule,
    MatDividerModule, MatListModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule, PageHeaderComponent, HasRoleDirective, EmptyStateComponent,
  ],
  template: `
    <app-page-header title="Aprovação de Plano (P03)" />

    <mat-card class="mb-4 border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
      <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
        <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
          <mat-icon class="text-primary">gavel</mat-icon>
          Aprovação de Plano
        </mat-card-title>
        <mat-card-subtitle class="text-xs text-text-sec">Perfil P03 (Presidente/Órgão Colegiado).</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="p-6">
        <p class="text-text-sec text-sm">
          Lista de planos submetidos aguardando aprovação. Perfil P03 (Presidente/Órgão Colegiado).
        </p>
      </mat-card-content>
    </mat-card>

    <mat-card class="mb-4 border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
      <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
        <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
          <mat-icon class="text-primary">filter_alt</mat-icon>
          Filtros
        </mat-card-title>
      </mat-card-header>
      <mat-card-content class="p-6">
        <form class="filter-bar gap-4 items-end" (ngSubmit)="carregarPlanos()" #filtroForm="ngForm">
          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="min-w-[180px]">
            <mat-label>Tipo</mat-label>
            <mat-select [(ngModel)]="filtroTipo" name="tipo">
              <mat-option value="">Todos</mat-option>
              <mat-option value="PALP">PALP</mat-option>
              <mat-option value="PAA">PAA</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="min-w-[180px]">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="filtroStatus" name="status">
              <mat-option value="SUBMETIDO">Submetido</mat-option>
              <mat-option value="APROVADO">Aprovado</mat-option>
              <mat-option value="">Todos</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" class="flex items-center gap-2">
            <mat-icon>search</mat-icon> Filtrar
          </button>
        </form>
      </mat-card-content>
    </mat-card>

    @if (carregando) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="40" />
      </div>
    }

    @for (plano of planos; track plano.id) {
      <mat-card class="mb-4 border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
        <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
          <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
            <mat-icon class="text-primary">assignment</mat-icon>
            {{ plano.tipo }} {{ plano.anoInicio }}-{{ plano.anoFim }}
            <app-status-badge [status]="plano.status" />
          </mat-card-title>
          <mat-card-subtitle class="text-xs text-text-sec">Versão {{ plano.versao }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="p-6">
          <h4 class="text-sm font-semibold text-text-main mb-2">Itens do Plano ({{ plano.itensPlano?.length || 0 }})</h4>
          @if (plano.itensPlano?.length) {
            <mat-list dense>
              @for (item of plano.itensPlano; track item.id) {
                <mat-list-item>
                  <mat-icon aria-hidden="true" matListItemIcon>assignment</mat-icon>
                  <span matListItemTitle>{{ item.tipoAuditoria }} — {{ item.objetivo }}</span>
                  <span matListItemLine>
                    {{ item.horasEstimadas }}h |
                    Unidade: {{ item.universo?.nome || 'N/A' }}
                  </span>
                </mat-list-item>
                <mat-divider />
              }
            </mat-list>
          } @else {
            <app-empty-state icon="assignment" title="Nenhum item no plano" size="sm" />
          }

          @if (plano.forcaTrabalho?.length) {
            <div class="mt-4 bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg text-sm text-text-main">
              <strong>Força de Trabalho:</strong>
              <span>{{ totalHorasDisponiveis(plano) }}h disponíveis</span>
              <span class="ms-4"
                    [class.text-green-700]="horasAlocadas(plano) <= totalHorasDisponiveis(plano)"
                    [class.text-red-600]="horasAlocadas(plano) > totalHorasDisponiveis(plano)">
                {{ horasAlocadas(plano) }}h alocadas
              </span>
            </div>
          }

          <div class="mt-4 flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            <button mat-raised-button color="primary" (click)="aprovar(plano.id)"
                    [disabled]="plano.status !== 'SUBMETIDO'" *appHasRole="'P03'">
              Aprovar
            </button>
            <button mat-stroked-button color="accent" (click)="publicar(plano.id)"
                    [disabled]="plano.status !== 'APROVADO'" *appHasRole="'P03'">
              Publicar
            </button>
            <button mat-button [routerLink]="['/planos', plano.id]">
              Ver Detalhes
            </button>
          </div>

          @if (actionMsg[plano.id]) {
            <p class="mt-2 text-sm"
               [class.text-green-700]="!actionError[plano.id]"
               [class.text-red-600]="actionError[plano.id]">
              {{ actionMsg[plano.id] }}
            </p>
          }
        </mat-card-content>
      </mat-card>
    } @empty {
      @if (!carregando) {
        <app-empty-state icon="search_off" title="Nenhum plano encontrado" description="Tente alterar os filtros selecionados." size="sm" />
      }
    }

    @if (error && planos.length) {
      <p class="text-red-600 text-center">{{ error }}</p>
    }
  `,
})
export class PlanoAprovacaoComponent implements OnInit {
  planos: any[] = [];
  filtroTipo = '';
  filtroStatus = 'SUBMETIDO';
  error = '';
  carregando = false;
  actionMsg: Record<string, string> = {};
  actionError: Record<string, boolean> = {};

  constructor(
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
  ) {}

  async ngOnInit() {
    await this.carregarPlanos();
  }

  async carregarPlanos() {
    this.carregando = true;
    this.error = '';
    try {
      const params: any = {};
      if (this.filtroTipo) params.tipo = this.filtroTipo;
      if (this.filtroStatus) params.status = this.filtroStatus;
      this.planos = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/planos`, { params }),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar planos';
    } finally {
      this.carregando = false;
    }
  }

  async aprovar(id: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Aprovar Plano', message: 'Confirmar aprovação deste plano? Esta ação é irreversível.', confirmText: 'Aprovar', type: 'warning' } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    this.actionMsg[id] = '';
    this.actionError[id] = false;
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/planos/${id}/aprovar`, {}));
      this.actionMsg[id] = 'Plano aprovado com sucesso';
      await this.carregarPlanos();
    } catch (err: any) {
      this.actionMsg[id] = err?.error?.message || 'Erro ao aprovar';
      this.actionError[id] = true;
    }
  }

  async publicar(id: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Publicar Plano', message: 'Confirmar publicação deste plano? Após publicado, não poderá ser alterado.', confirmText: 'Publicar', type: 'warning' } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    this.actionMsg[id] = '';
    this.actionError[id] = false;
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/planos/${id}/publicar`, {}));
      this.actionMsg[id] = 'Plano publicado com sucesso';
      await this.carregarPlanos();
    } catch (err: any) {
      this.actionMsg[id] = err?.error?.message || 'Erro ao publicar';
      this.actionError[id] = true;
    }
  }

  totalHorasDisponiveis(plano: any): number {
    return (plano.forcaTrabalho || []).reduce((s: number, f: any) => s + f.horasDisponiveisAno, 0);
  }

  horasAlocadas(plano: any): number {
    return (plano.itensPlano || []).reduce((s: number, i: any) => s + (i.horasEstimadas || 0), 0);
  }


}
