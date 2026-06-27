import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-plano-aprovacao',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatChipsModule,
    MatDividerModule, MatListModule, MatIconModule,
    MatFormFieldModule, MatSelectModule,
  ],
  template: `
    <h1>Aprovação de Plano (P03)</h1>

    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content>
        <p style="color: #666;">
          Lista de planos submetidos aguardando aprovação. Perfil P03 (Presidente/Órgão Colegiado).
        </p>
      </mat-card-content>
    </mat-card>

    <!-- Filtro -->
    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content>
        <form style="display: flex; gap: 1rem; align-items: flex-end;" (ngSubmit)="carregarPlanos()">
          <mat-form-field appearance="outline" style="min-width: 180px;">
            <mat-label>Tipo</mat-label>
            <mat-select [(ngModel)]="filtroTipo" name="tipo">
              <mat-option value="">Todos</mat-option>
              <mat-option value="PALP">PALP</mat-option>
              <mat-option value="PAA">PAA</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" style="min-width: 180px;">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="filtroStatus" name="status">
              <mat-option value="SUBMETIDO">Submetido</mat-option>
              <mat-option value="APROVADO">Aprovado</mat-option>
              <mat-option value="">Todos</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit">Filtrar</button>
        </form>
      </mat-card-content>
    </mat-card>

    <!-- Lista de planos -->
    <mat-card *ngFor="let plano of planos" style="margin-bottom: 1rem;">
      <mat-card-header>
        <mat-card-title>
          {{ plano.tipo }} {{ plano.anoInicio }}-{{ plano.anoFim }}
          <mat-chip [style.background]="statusColor(plano.status)" style="color: #fff; margin-left: 0.5rem; font-size: 0.75rem;">
            {{ plano.status }}
          </mat-chip>
        </mat-card-title>
        <mat-card-subtitle>Versão {{ plano.versao }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <h4>Itens do Plano ({{ plano.itensPlano?.length || 0 }})</h4>
        <mat-list dense *ngIf="plano.itensPlano?.length; else semItens">
          @for (item of plano.itensPlano; track item.id) {
            <mat-list-item>
              <mat-icon matListItemIcon>assignment</mat-icon>
              <span matListItemTitle>{{ item.tipoAuditoria }} — {{ item.objetivo }}</span>
              <span matListItemLine>
                {{ item.horasEstimadas }}h |
                Unidade: {{ item.universo?.nome || 'N/A' }}
              </span>
            </mat-list-item>
            <mat-divider />
          }
        </mat-list>
        <ng-template #semItens>
          <p style="color: #999;">Nenhum item no plano.</p>
        </ng-template>

        <!-- Horas -->
        <div *ngIf="plano.forcTrabalho?.length" style="margin-top: 1rem; background: #f5f5f5; padding: 0.5rem 1rem; border-radius: 4px;">
          <strong>Força de Trabalho:</strong>
          <span>{{ totalHorasDisponiveis(plano) }}h disponíveis</span>
          <span style="margin-left: 1rem; color: {{ horasAlocadas(plano) > totalHorasDisponiveis(plano) ? '#c62828' : '#2e7d32' }};">
            {{ horasAlocadas(plano) }}h alocadas
          </span>
        </div>

        <!-- Ações -->
        <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
          <button mat-raised-button color="primary" (click)="aprovar(plano.id)"
                  [disabled]="plano.status !== 'SUBMETIDO'">
            Aprovar
          </button>
          <button mat-stroked-button color="accent" (click)="publicar(plano.id)"
                  [disabled]="plano.status !== 'APROVADO'">
            Publicar
          </button>
          <button mat-button [routerLink]="['/planos', plano.id]">
            Ver Detalhes
          </button>
        </div>

        <p *ngIf="actionMsg[plano.id]" [style.color]="actionError[plano.id] ? '#c62828' : '#2e7d32'" style="margin-top: 0.5rem;">
          {{ actionMsg[plano.id] }}
        </p>
      </mat-card-content>
    </mat-card>

    <p *ngIf="!planos.length && !error" style="text-align: center; color: #999; padding: 2rem;">
      Nenhum plano encontrado com os filtros selecionados.
    </p>
    <p *ngIf="error" style="color: #c62828; text-align: center;">{{ error }}</p>
  `,
})
export class PlanoAprovacaoComponent implements OnInit {
  planos: any[] = [];
  filtroTipo = '';
  filtroStatus = 'SUBMETIDO';
  error = '';
  actionMsg: Record<string, string> = {};
  actionError: Record<string, boolean> = {};

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await this.carregarPlanos();
  }

  async carregarPlanos() {
    this.error = '';
    try {
      const params: any = {};
      if (this.filtroTipo) params.tipo = this.filtroTipo;
      if (this.filtroStatus) params.status = this.filtroStatus;
      // Incluir SUBMETIDO e APROVADO por padrão se sem filtro
      this.planos = await firstValueFrom(
        this.http.get<any[]>(`${API}/planos`, { params }),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar planos';
    }
  }

  async aprovar(id: string) {
    this.actionMsg[id] = '';
    this.actionError[id] = false;
    try {
      await firstValueFrom(this.http.post(`${API}/planos/${id}/aprovar`, {}));
      this.actionMsg[id] = 'Plano aprovado com sucesso';
      await this.carregarPlanos();
    } catch (err: any) {
      this.actionMsg[id] = err?.error?.message || 'Erro ao aprovar';
      this.actionError[id] = true;
    }
  }

  async publicar(id: string) {
    this.actionMsg[id] = '';
    this.actionError[id] = false;
    try {
      await firstValueFrom(this.http.post(`${API}/planos/${id}/publicar`, {}));
      this.actionMsg[id] = 'Plano publicado com sucesso';
      await this.carregarPlanos();
    } catch (err: any) {
      this.actionMsg[id] = err?.error?.message || 'Erro ao publicar';
      this.actionError[id] = true;
    }
  }

  totalHorasDisponiveis(plano: any): number {
    return (plano.forcTrabalho || []).reduce((s: number, f: any) => s + f.horasDisponiveisAno, 0);
  }

  horasAlocadas(plano: any): number {
    return (plano.itensPlano || []).reduce((s: number, i: any) => s + (i.horasEstimadas || 0), 0);
  }

  statusColor(status: string): string {
    const m: Record<string, string> = {
      RASCUNHO: '#888',
      SUBMETIDO: '#1565c0',
      APROVADO: '#2e7d32',
      PUBLICADO: '#6a1b9a',
    };
    return m[status] || '#888';
  }
}
