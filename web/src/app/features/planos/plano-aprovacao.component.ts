import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { HasRoleDirective } from '../../core/directives/has-role.directive';

@Component({
  selector: 'app-plano-aprovacao',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, StatusBadgeComponent,
    MatCardModule, MatButtonModule,
    MatDividerModule, MatListModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule, PageHeaderComponent, HasRoleDirective,
  ],
  template: `
    <app-page-header title="Aprovação de Plano (P03)" />

    <mat-card class="mb-4">
      <mat-card-content>
        <p class="text-text-sec">
          Lista de planos submetidos aguardando aprovação. Perfil P03 (Presidente/Órgão Colegiado).
        </p>
      </mat-card-content>
    </mat-card>

    <mat-card class="mb-4">
      <mat-card-content>
        <form class="flex gap-4 items-end" (ngSubmit)="carregarPlanos()">
          <mat-form-field appearance="outline" class="min-w-[180px]">
            <mat-label>Tipo</mat-label>
            <mat-select [(ngModel)]="filtroTipo" name="tipo">
              <mat-option value="">Todos</mat-option>
              <mat-option value="PALP">PALP</mat-option>
              <mat-option value="PAA">PAA</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="min-w-[180px]">
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

    @if (carregando) {
      <div class="flex justify-center p-8">
        <mat-spinner diameter="40" />
      </div>
    }

    @for (plano of planos; track plano.id) {
      <mat-card class="mb-4">
        <mat-card-header>
          <mat-card-title>
            {{ plano.tipo }} {{ plano.anoInicio }}-{{ plano.anoFim }}
            <app-status-badge [status]="plano.status" />
          </mat-card-title>
          <mat-card-subtitle>Versão {{ plano.versao }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <h4>Itens do Plano ({{ plano.itensPlano?.length || 0 }})</h4>
          @if (plano.itensPlano?.length) {
            <mat-list dense>
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
          } @else {
            <p class="text-text-sec">Nenhum item no plano.</p>
          }

          @if (plano.forcaTrabalho?.length) {
            <div class="mt-4 bg-background px-4 py-2 rounded">
              <strong>Força de Trabalho:</strong>
              <span>{{ totalHorasDisponiveis(plano) }}h disponíveis</span>
              <span class="ms-4"
                    [class.text-success]="horasAlocadas(plano) <= totalHorasDisponiveis(plano)"
                    [class.text-critical]="horasAlocadas(plano) > totalHorasDisponiveis(plano)">
                {{ horasAlocadas(plano) }}h alocadas
              </span>
            </div>
          }

          <div class="mt-4 flex gap-2">
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
            <p class="mt-2"
               [class.text-success]="!actionError[plano.id]"
               [class.text-critical]="actionError[plano.id]">
              {{ actionMsg[plano.id] }}
            </p>
          }
        </mat-card-content>
      </mat-card>
    } @empty {
      @if (!carregando) {
        <p class="text-center text-text-sec p-8">
          Nenhum plano encontrado com os filtros selecionados.
        </p>
      }
    }

    @if (error && planos.length) {
      <p class="text-critical text-center">{{ error }}</p>
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

  constructor(private readonly http: HttpClient) {}

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
