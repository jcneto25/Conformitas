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

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-recomendacao-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatListModule, MatIconModule,
    MatDividerModule, MatChipsModule,
  ],
  template: `
    <h1>Recomendação</h1>

    <!-- Detalhes -->
    <mat-card *ngIf="recomendacao" style="margin-bottom: 1rem;">
      <mat-card-content>
        <p><strong>Descrição:</strong> {{ recomendacao.descricao }}</p>
        <p>
          <strong>Criticidade:</strong>
          <mat-chip [style.background]="criticidadeColor(recomendacao.criticidade)" style="color: #fff; margin-left: 0.5rem;">
            {{ recomendacao.criticidade }}
          </mat-chip>
        </p>
        <p>
          <strong>Status:</strong>
          <mat-chip [style.background]="statusColor(recomendacao.status)" style="color: #fff; margin-left: 0.5rem;">
            {{ recomendacao.status }}
          </mat-chip>
        </p>
        <p><strong>Prazo:</strong> {{ recomendacao.prazo | date:'dd/MM/yyyy' }}</p>
        <p *ngIf="recomendacao.relatorio"><strong>Relatório:</strong> {{ recomendacao.relatorio.tipo || recomendacao.relatorioId }}</p>
      </mat-card-content>
    </mat-card>

    <!-- Providências -->
    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content>
        <h3>Providências</h3>
        <mat-list *ngIf="providencias.length; else semProvidencias">
          @for (p of providencias; track p.id) {
            <mat-list-item>
              <mat-icon matListItemIcon>check_circle</mat-icon>
              <span matListItemTitle>{{ p.descricao }}</span>
              <span matListItemLine style="color: #888; font-size: 0.8rem;">
                {{ p.data | date:'dd/MM/yyyy HH:mm' }}
                <span *ngIf="p.evidenciaPath"> — Evidência: {{ p.evidenciaPath }}</span>
              </span>
            </mat-list-item>
            <mat-divider />
          }
        </mat-list>
        <ng-template #semProvidencias>
          <p style="color: #999;">Nenhuma providência registrada.</p>
        </ng-template>

        <!-- Form registrar providência (P05) -->
        <div *ngIf="recomendacao && recomendacao.status !== 'CUMPRIDA' && recomendacao.status !== 'CANCELADA'"
             style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
          <h4>Registrar Providência (P05)</h4>
          <form (ngSubmit)="registrarProvidencia()" style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
            <mat-form-field appearance="outline" style="min-width: 300px; flex: 1;">
              <mat-label>Descrição da Providência</mat-label>
              <textarea matInput [(ngModel)]="form.descricao" name="descricao" required rows="2"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" style="min-width: 200px;">
              <mat-label>Evidência (caminho)</mat-label>
              <input matInput [(ngModel)]="form.evidenciaPath" name="evidenciaPath" placeholder="/files/evidencia.pdf" />
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="!form.descricao">
              Registrar
            </button>
          </form>

          <p *ngIf="success" style="color: #2e7d32; margin-top: 0.5rem;">{{ success }}</p>
          <p *ngIf="error" style="color: #c62828; margin-top: 0.5rem;">{{ error }}</p>
        </div>
      </mat-card-content>
    </mat-card>

    <!-- Botão validar (P02) -->
    <mat-card *ngIf="recomendacao && recomendacao.status === 'EM_ANDAMENTO'" style="margin-bottom: 1rem;">
      <mat-card-content>
        <h3>Validação (P02)</h3>
        <p style="color: #666;">Confirmar que a recomendação foi implementada e está CUMPRIDA.</p>
        <button mat-raised-button color="accent" (click)="validar()">
          Validar Implementação
        </button>
      </mat-card-content>
    </mat-card>

    <p *ngIf="loadError" style="color: #c62828; text-align: center;">{{ loadError }}</p>
  `,
})
export class RecomendacaoDetailComponent implements OnInit {
  recomendacao: any = null;
  providencias: any[] = [];
  form = { descricao: '', evidenciaPath: '' };
  error = '';
  success = '';
  loadError = '';
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
    this.loadError = '';
    try {
      this.recomendacao = await firstValueFrom(
        this.http.get<any>(`${API}/recomendacoes/${this.id}`),
      );
      this.providencias = this.recomendacao.providencias || [];
    } catch (err: any) {
      this.loadError = err?.error?.message || 'Erro ao carregar recomendação';
    }
  }

  async registrarProvidencia() {
    if (!this.form.descricao) return;
    this.error = '';
    this.success = '';
    try {
      await firstValueFrom(
        this.http.post(`${API}/recomendacoes/${this.id}/providencias`, {
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
        this.http.post(`${API}/recomendacoes/${this.id}/validar`, {}),
      );
      await this.carregar();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao validar recomendação';
    }
  }

  criticidadeColor(criticidade: string): string {
    const m: Record<string, string> = { ALTA: '#c62828', MEDIA: '#e65100', BAIXA: '#2e7d32' };
    return m[criticidade] || '#888';
  }

  statusColor(status: string): string {
    const m: Record<string, string> = {
      PENDENTE: '#1565c0', EM_ANDAMENTO: '#e65100', CUMPRIDA: '#2e7d32', VENCIDA: '#c62828', CANCELADA: '#888',
    };
    return m[status] || '#888';
  }
}
