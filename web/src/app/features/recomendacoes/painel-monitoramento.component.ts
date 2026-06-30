import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({
  selector: 'app-painel-monitoramento',
  standalone: true,
  imports: [
    CommonModule, StatusBadgeComponent,
    MatCardModule, MatProgressSpinnerModule,
    MatIconModule, MatTableModule, MatButtonModule, PageHeaderComponent,
  ],
  template: `
    <app-page-header title="Painel de Monitoramento (P01, P06)" />

    @if (loading) {
      <div class="flex justify-center p-8"><mat-spinner diameter="40" /></div>
    } @else {
      <div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        <mat-card>
          <mat-card-content>
            <div class="text-4xl font-bold text-center text-info">{{ pendentes }}</div>
            <div class="text-center text-text-sec text-sm">Pendentes</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <div class="text-4xl font-bold text-center text-warning">{{ emAndamento }}</div>
            <div class="text-center text-text-sec text-sm">Em Andamento</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <div class="text-4xl font-bold text-center text-success">{{ cumpridas }}</div>
            <div class="text-center text-text-sec text-sm">Cumpridas</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <div class="text-4xl font-bold text-center text-critical">{{ vencidas }}</div>
            <div class="text-center text-text-sec text-sm">Vencidas</div>
          </mat-card-content>
        </mat-card>
      </div>

      @if (recomendacoesVencidas.length) {
        <mat-card class="mt-4 border-l-4 border-red-600">
          <mat-card-header>
            <mat-card-title class="text-critical">
              <mat-icon class="align-middle">warning</mat-icon>
              Recomendações Vencidas ({{ recomendacoesVencidas.length }})
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="recomendacoesVencidas" class="mat-elevation-z0 w-full">
              <ng-container matColumnDef="descricao">
                <th mat-header-cell *matHeaderCellDef>Descrição</th>
                <td mat-cell *matCellDef="let r">{{ r.descricao }}</td>
              </ng-container>
              <ng-container matColumnDef="criticidade">
                <th mat-header-cell *matHeaderCellDef>Criticidade</th>
                <td mat-cell *matCellDef="let r">
                  <app-status-badge [status]="r.criticidade" />
                </td>
              </ng-container>
              <ng-container matColumnDef="prazo">
                <th mat-header-cell *matHeaderCellDef>Prazo</th>
                <td mat-cell *matCellDef="let r" class="text-critical font-semibold">
                  {{ r.prazo | date:'dd/MM/yyyy' }}
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['descricao', 'criticidade', 'prazo']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['descricao', 'criticidade', 'prazo'];"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      }
    }

    @if (error) {
      <p class="text-critical text-center mt-4">{{ error }}</p>
    }
  `,
})
export class PainelMonitoramentoComponent implements OnInit {
  recomendacoes: any[] = [];
  recomendacoesVencidas: any[] = [];
  loading = true;
  error = '';

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    this.loading = true;
    this.error = '';
    try {
      this.recomendacoes = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/recomendacoes`),
      );
      this.recomendacoesVencidas = this.recomendacoes.filter(r => r.status === 'VENCIDA');
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar recomendações';
    } finally {
      this.loading = false;
    }
  }

  get pendentes(): number {
    return this.recomendacoes.filter(r => r.status === 'PENDENTE').length;
  }

  get emAndamento(): number {
    return this.recomendacoes.filter(r => r.status === 'EM_ANDAMENTO').length;
  }

  get cumpridas(): number {
    return this.recomendacoes.filter(r => r.status === 'CUMPRIDA').length;
  }

  get vencidas(): number {
    return this.recomendacoesVencidas.length;
  }


}
