import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { HasRoleDirective } from '../../core/directives/has-role.directive';
import { ValidationService } from '../../shared/services/validation.service';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-recomendacao-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, StatusBadgeComponent, MatDialogModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatListModule, MatIconModule,
    MatDividerModule, MatProgressSpinnerModule, PageHeaderComponent, HasRoleDirective, EmptyStateComponent,
  ],
  template: `
    <app-page-header
      title="Recomendação"
      [breadcrumbs]="[
        { label: 'Recomendações', route: '/recomendacoes' },
        { label: 'Detalhes' }
      ]"
    />

    @if (loading) {
      <div class="flex justify-center py-12"><mat-spinner diameter="40" /></div>
    } @else {
      @if (recomendacao) {
        <mat-card class="form-section">
          <mat-card-header class="form-section-header">
            <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
              <mat-icon class="text-primary">flag</mat-icon>
              Detalhes da Recomendação
            </mat-card-title>
            <mat-card-subtitle class="text-xs text-text-sec">Atributos e prazos da recomendação.</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="form-section-content">
            <dl class="form-grid gap-6">
              <div class="md:col-span-2">
                <dt class="text-xs text-text-sec uppercase tracking-wide font-medium">Descrição</dt>
                <dd class="text-text-main mt-1">{{ recomendacao.descricao }}</dd>
              </div>
              <div>
                <dt class="text-xs text-text-sec uppercase tracking-wide font-medium">Criticidade</dt>
                <dd class="mt-1">
                  <app-status-badge [status]="recomendacao.criticidade" />
                </dd>
              </div>
              <div>
                <dt class="text-xs text-text-sec uppercase tracking-wide font-medium">Status</dt>
                <dd class="mt-1">
                  <app-status-badge [status]="recomendacao.status" />
                </dd>
              </div>
              <div>
                <dt class="text-xs text-text-sec uppercase tracking-wide font-medium">Prazo</dt>
                <dd class="text-text-main mt-1 font-medium">{{ recomendacao.prazo | date:'dd/MM/yyyy' }}</dd>
              </div>
              @if (recomendacao.relatorio) {
                <div>
                  <dt class="text-xs text-text-sec uppercase tracking-wide font-medium">Relatório</dt>
                  <dd class="text-text-main mt-1">{{ recomendacao.relatorio.tipo || recomendacao.relatorioId }}</dd>
                </div>
              }
            </dl>
          </mat-card-content>
        </mat-card>
      }

      <mat-card class="mt-6 form-section">
        <mat-card-header class="form-section-header">
          <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
            <mat-icon class="text-primary">task_alt</mat-icon>
            Providências
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="form-section-content">
          @if (providencias.length) {
            <mat-list>
              @for (p of providencias; track p.id) {
                <mat-list-item>
                  <mat-icon aria-hidden="true" matListItemIcon>check_circle</mat-icon>
                  <span matListItemTitle>{{ p.descricao }}</span>
                  <span matListItemLine class="text-text-sec text-xs">
                    {{ p.data | date:'dd/MM/yyyy HH:mm' }}
                    @if (p.evidenciaPath) {
                      <span> — Evidência: {{ p.evidenciaPath }}</span>
                    }
                  </span>
                </mat-list-item>
                <mat-divider />
              }
            </mat-list>
          } @else {
            <app-empty-state icon="task_alt" title="Nenhuma providência registrada" description="O gestor da unidade auditada ainda não registrou providências para esta recomendação." size="sm" />
          }

          @if (recomendacao && recomendacao.status !== 'CUMPRIDA' && recomendacao.status !== 'CANCELADA') {
            <div class="mt-6 pt-4 border-t border-gray-100" *appHasRole="'P05'">
              <h4 class="text-sm font-semibold text-text-main mb-4 flex items-center gap-2">
                <mat-icon class="text-primary text-[18px]">add_task</mat-icon>
                Registrar Providência (P05)
              </h4>
              <form (ngSubmit)="registrarProvidencia()" class="flex flex-col gap-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="md:col-span-2">
                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Descrição da Providência</mat-label>
                      <textarea matInput #descModel="ngModel" [(ngModel)]="form.descricao" name="descricao" required rows="2"></textarea>
                      @if (descModel.invalid && descModel.touched) {
                        <mat-error>{{ validation.required('Descrição da providência') }}</mat-error>
                      }
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Caminho da Evidência</mat-label>
                    <input matInput [(ngModel)]="form.evidenciaPath" name="evidenciaPath" placeholder="/files/evidencia.pdf" />
                  </mat-form-field>
                </div>

                <div class="flex justify-end">
                  <button mat-raised-button color="primary" type="submit" [disabled]="!form.descricao" class="flex items-center gap-2">
                    <mat-icon>add_task</mat-icon>
                    Registrar
                  </button>
                </div>
              </form>

              @if (success) {
                <div class="flex items-center gap-2 text-success text-sm p-3 bg-success-bg rounded-lg border border-success/20 mt-3" role="status">
                  <mat-icon class="text-[18px]">check_circle</mat-icon>
                  <span>{{ success }}</span>
                </div>
              }
              @if (error) {
                <div class="flex items-center gap-2 text-critical text-sm p-3 bg-critical-bg rounded-lg border border-critical/20 mt-3" role="alert">
                  <mat-icon class="text-[18px]">error_outline</mat-icon>
                  <span>{{ error }}</span>
                </div>
              }
            </div>
          }
        </mat-card-content>
      </mat-card>

      @if (recomendacao && recomendacao.status === 'EM_ANDAMENTO') {
        <mat-card class="mt-6 form-section">
          <mat-card-header class="form-section-header">
            <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
              <mat-icon class="text-primary">verified</mat-icon>
              Validação (P02)
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="form-section-content">
            <p class="text-text-sec text-sm mb-4">Confirme que a recomendação foi implementada e está <strong>CUMPRIDA</strong>.</p>
            <button mat-raised-button color="accent" (click)="validar()" *appHasRole="'P02'" class="flex items-center gap-2">
              <mat-icon>check_circle</mat-icon>
              Validar Implementação
            </button>
          </mat-card-content>
        </mat-card>
      }
    }

    @if (loadError) {
      <mat-card class="border border-critical/20 bg-critical-bg rounded-xl shadow-sm">
        <mat-card-content class="flex items-center gap-2 text-critical p-4">
          <mat-icon>error_outline</mat-icon>
          <span class="text-sm">{{ loadError }}</span>
        </mat-card-content>
      </mat-card>
    }
  `,
})
export class RecomendacaoDetailComponent implements OnInit {
  recomendacao: any = null;
  providencias: any[] = [];
  form = { descricao: '', evidenciaPath: '' };
  error = '';
  success = '';
  loadError = '';
  loading = true;
  private id = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
    public readonly validation: ValidationService,
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (!this.id) return;
    await this.carregar();
  }

  async carregar() {
    this.loading = true;
    this.loadError = '';
    try {
      this.recomendacao = await firstValueFrom(
        this.http.get<any>(`${environment.apiUrl}/recomendacoes/${this.id}`),
      );
      this.providencias = this.recomendacao.providencias || [];
    } catch (err: any) {
      this.loadError = err?.error?.message || 'Erro ao carregar recomendação';
    } finally {
      this.loading = false;
    }
  }

  async registrarProvidencia() {
    if (!this.form.descricao) return;
    this.error = '';
    this.success = '';
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/recomendacoes/${this.id}/providencias`, {
          descricao: this.form.descricao,
          autorId: 'current-user',
          evidenciaPath: this.form.evidenciaPath || undefined,
        }),
      );
      this.success = 'Providência registrada com sucesso';
      this.form = { descricao: '', evidenciaPath: '' };
      await this.carregar();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao registrar providência';
    }
  }

  async validar() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Validar Implementação', message: 'Confirmar que a recomendação foi implementada e está CUMPRIDA? Esta ação é irreversível.', confirmText: 'Validar', type: 'warning' } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    this.error = '';
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/recomendacoes/${this.id}/validar`, {}),
      );
      await this.carregar();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao validar recomendação';
    }
  }
}
