import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { HasRoleDirective } from '../../core/directives/has-role.directive';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-plano-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, MatDialogModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule,
    StatusBadgeComponent, EmptyStateComponent, PageHeaderComponent, HasRoleDirective,
  ],
  template: `
    <app-page-header title="Planos de Auditoria">
      <a mat-raised-button color="primary" routerLink="/planos/novo" *appHasRole="'P01'">
        <mat-icon>add</mat-icon> Novo Plano
      </a>
    </app-page-header>

    <mat-card class="mb-4 border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
      <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
        <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
          <mat-icon class="text-primary">filter_alt</mat-icon>
          Filtros
        </mat-card-title>
      </mat-card-header>
      <mat-card-content class="p-6">
        <form class="filter-bar gap-4 items-end" (ngSubmit)="carregar()" #filtroForm="ngForm">
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
              <mat-option value="">Todos</mat-option>
              <mat-option value="RASCUNHO">Rascunho</mat-option>
              <mat-option value="SUBMETIDO">Submetido</mat-option>
              <mat-option value="APROVADO">Aprovado</mat-option>
              <mat-option value="PUBLICADO">Publicado</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" class="flex items-center gap-2">
            <mat-icon>search</mat-icon> Filtrar
          </button>
        </form>
      </mat-card-content>
    </mat-card>

    @if (showPaaAlert) {
      <div class="flex items-center gap-3 p-4 mb-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm" role="alert">
        <mat-icon class="text-orange-600">warning_amber</mat-icon>
        <div>
          <strong>Atenção:</strong> O PAA {{ anoAtual }} deve ser submetido até <strong>30 de novembro</strong>.
          <a routerLink="/planos/novo" class="underline font-semibold ms-2">Criar PAA</a>
        </div>
      </div>
    }

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
          <div class="flex flex-wrap gap-2">
            <button mat-stroked-button [routerLink]="['/planos', plano.id]" *appHasRole="'P01'" class="flex items-center gap-1">
              <mat-icon>edit</mat-icon> Editar
            </button>

            @if (plano.status === 'RASCUNHO') {
              <button mat-raised-button color="primary" (click)="submeter(plano)" *appHasRole="'P01'" class="flex items-center gap-1">
                <mat-icon>send</mat-icon> Submeter
              </button>
              <button mat-stroked-button color="warn" (click)="remover(plano)" *appHasRole="'P01'" class="flex items-center gap-1">
                <mat-icon>delete</mat-icon> Remover
              </button>
            }

            @if (plano.status === 'SUBMETIDO') {
              <button mat-stroked-button color="accent" (click)="devolver(plano)" *appHasRole="'P03'" class="flex items-center gap-1">
                <mat-icon>undo</mat-icon> Devolver
              </button>
            }
          </div>

          @if (msgMap[plano.id]) {
            <p class="mt-2 text-sm" [class.text-green-700]="!errMap[plano.id]" [class.text-red-600]="errMap[plano.id]">
              {{ msgMap[plano.id] }}
            </p>
          }
        </mat-card-content>
      </mat-card>
    } @empty {
      @if (!carregando) {
        <app-empty-state icon="assignment" title="Nenhum plano encontrado" description="Crie um novo plano de auditoria ou ajuste os filtros." size="sm" />
      }
    }
  `,
})
export class PlanoListComponent implements OnInit {
  planos: any[] = [];
  filtroTipo = '';
  filtroStatus = '';
  carregando = false;
  msgMap: Record<string, string> = {};
  errMap: Record<string, boolean> = {};
  readonly anoAtual = new Date().getFullYear();

  get showPaaAlert(): boolean {
    const hoje = new Date();
    if (hoje.getMonth() < 10) return false;
    const hasSubmittedPaa = this.planos.some(
      (p) => p.tipo === 'PAA' && p.anoInicio === this.anoAtual && !['RASCUNHO'].includes(p.status),
    );
    return !hasSubmittedPaa;
  }

  constructor(
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
    private readonly toast: ToastService,
  ) {}

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    this.carregando = true;
    try {
      const params: any = {};
      if (this.filtroTipo) params.tipo = this.filtroTipo;
      if (this.filtroStatus) params.status = this.filtroStatus;
      this.planos = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/planos`, { params }),
      );
    } catch {
      this.toast.show('Erro ao carregar planos', 'error');
    } finally {
      this.carregando = false;
    }
  }

  async submeter(plano: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Submeter Plano', message: `Confirmar submissão do ${plano.tipo} ${plano.anoInicio}-${plano.anoFim}?`, confirmText: 'Submeter', type: 'warning' } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    this.msgMap[plano.id] = '';
    this.errMap[plano.id] = false;
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/planos/${plano.id}/submeter`, {}));
      this.toast.show('Plano submetido com sucesso', 'success');
      await this.carregar();
    } catch (err: any) {
      this.msgMap[plano.id] = err?.error?.message || 'Erro ao submeter';
      this.errMap[plano.id] = true;
    }
  }

  async devolver(plano: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Devolver Plano', message: `Devolver ${plano.tipo} ${plano.anoInicio}-${plano.anoFim} para ajustes?`, confirmText: 'Devolver', type: 'warning' } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    this.msgMap[plano.id] = '';
    this.errMap[plano.id] = false;
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/planos/${plano.id}/devolver`, { motivo: 'Devolução solicitada' }));
      this.toast.show('Plano devolvido para ajustes', 'success');
      await this.carregar();
    } catch (err: any) {
      this.msgMap[plano.id] = err?.error?.message || 'Erro ao devolver';
      this.errMap[plano.id] = true;
    }
  }

  async remover(plano: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Remover Plano', message: `Remover permanentemente o ${plano.tipo} ${plano.anoInicio}-${plano.anoFim}?`, confirmText: 'Remover', type: 'danger' } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    try {
      await firstValueFrom(this.http.delete(`${environment.apiUrl}/planos/${plano.id}`));
      this.toast.show('Plano removido', 'success');
      await this.carregar();
    } catch (err: any) {
      this.toast.show(err?.error?.message || 'Erro ao remover', 'error');
    }
  }
}
