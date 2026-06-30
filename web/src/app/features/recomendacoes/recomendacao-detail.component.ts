import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
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

@Component({
  selector: 'app-recomendacao-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, StatusBadgeComponent,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatListModule, MatIconModule,
    MatDividerModule, MatProgressSpinnerModule, PageHeaderComponent, HasRoleDirective,
  ],
  template: `
    <app-page-header title="Recomendação" />

    @if (loading) {
      <div class="flex justify-center p-8"><mat-spinner diameter="40" /></div>
    } @else {
      @if (recomendacao) {
        <mat-card class="mb-4">
          <mat-card-content>
            <p><strong>Descrição:</strong> {{ recomendacao.descricao }}</p>
            <p>
              <strong>Criticidade:</strong>
              <app-status-badge [status]="recomendacao.criticidade" />
            </p>
            <p>
              <strong>Status:</strong>
              <app-status-badge [status]="recomendacao.status" />
            </p>
            <p><strong>Prazo:</strong> {{ recomendacao.prazo | date:'dd/MM/yyyy' }}</p>
            @if (recomendacao.relatorio) {
              <p><strong>Relatório:</strong> {{ recomendacao.relatorio.tipo || recomendacao.relatorioId }}</p>
            }
          </mat-card-content>
        </mat-card>
      }

      <mat-card class="mb-4">
        <mat-card-content>
          <h3>Providências</h3>
          @if (providencias.length) {
            <mat-list>
              @for (p of providencias; track p.id) {
                <mat-list-item>
                  <mat-icon matListItemIcon>check_circle</mat-icon>
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
            <p class="text-text-sec">Nenhuma providência registrada.</p>
          }

          @if (recomendacao && recomendacao.status !== 'CUMPRIDA' && recomendacao.status !== 'CANCELADA') {
            <div class="mt-4 pt-4 border-t" *appHasRole="'P05'">
              <h4>Registrar Providência (P05)</h4>
              <form (ngSubmit)="registrarProvidencia()" class="flex gap-4 items-end flex-wrap">
                <mat-form-field appearance="outline" class="min-w-[300px] flex-1">
                  <mat-label>Descrição da Providência</mat-label>
                  <textarea matInput #descModel="ngModel" [(ngModel)]="form.descricao" name="descricao" required rows="2"></textarea>
                  @if (descModel.invalid && descModel.touched) {
                    <mat-error>Descrição obrigatória</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="min-w-[200px]">
                  <mat-label>Evidência (caminho)</mat-label>
                  <input matInput [(ngModel)]="form.evidenciaPath" name="evidenciaPath" placeholder="/files/evidencia.pdf" />
                </mat-form-field>

                <button mat-raised-button color="primary" type="submit" [disabled]="!form.descricao">
                  Registrar
                </button>
              </form>

              @if (success) {
                <p class="text-success mt-2">{{ success }}</p>
              }
              @if (error) {
                <p class="text-critical mt-2">{{ error }}</p>
              }
            </div>
          }
        </mat-card-content>
      </mat-card>

      @if (recomendacao && recomendacao.status === 'EM_ANDAMENTO') {
        <mat-card class="mb-4">
          <mat-card-content>
            <h3>Validação (P02)</h3>
            <p class="text-text-sec">Confirmar que a recomendação foi implementada e está CUMPRIDA.</p>
            <button mat-raised-button color="accent" (click)="validar()" *appHasRole="'P02'">
              Validar Implementação
            </button>
          </mat-card-content>
        </mat-card>
      }
    }

    @if (loadError) {
      <p class="text-critical text-center">{{ loadError }}</p>
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
