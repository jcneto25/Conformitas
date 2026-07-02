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
        <mat-card class="border-t-4 border-primary shadow-sm rounded-xl">
          <mat-card-content class="p-5">
            <div class="text-3xl font-bold text-text-main text-blue-700">{{ pendentes }}</div>
            <div class="text-text-sec text-sm mt-1">Pendentes</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="border-t-4 border-primary shadow-sm rounded-xl">
          <mat-card-content class="p-5">
            <div class="text-3xl font-bold text-text-main text-amber-700">{{ emAndamento }}</div>
            <div class="text-text-sec text-sm mt-1">Em Andamento</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="border-t-4 border-primary shadow-sm rounded-xl">
          <mat-card-content class="p-5">
            <div class="text-3xl font-bold text-text-main text-green-700">{{ cumpridas }}</div>
            <div class="text-text-sec text-sm mt-1">Cumpridas</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="border-t-4 border-primary shadow-sm rounded-xl">
          <mat-card-content class="p-5">
            <div class="text-3xl font-bold text-text-main text-red-600">{{ vencidas }}</div>
            <div class="text-text-sec text-sm mt-1">Vencidas</div>
          </mat-card-content>
        </mat-card>
      </div>

      @if (recomendacoesVencidas.length) {
        <mat-card class="mt-6 border-l-4 border-red-600 shadow-md rounded-xl overflow-hidden">
          <mat-card-header class="px-6 py-4 border-b border-gray-100">
            <mat-card-title class="text-lg font-semibold text-red-600 flex items-center gap-2">
              <mat-icon class="text-red-600">warning</mat-icon>
              Recomendações Vencidas ({{ recomendacoesVencidas.length }})
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="p-0">
            <div class="shadow-sm rounded-xl overflow-hidden border border-gray-100 bg-white">
              <table mat-table [dataSource]="recomendacoesVencidas" class="mat-elevation-z0 w-full">
                <ng-container matColumnDef="descricao">
                  <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main">Descrição</th>
                  <td mat-cell *matCellDef="let r" class="py-3 px-4">{{ r.descricao }}</td>
                </ng-container>
                <ng-container matColumnDef="criticidade">
                  <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main">Criticidade</th>
                  <td mat-cell *matCellDef="let r" class="py-3 px-4">
                    <app-status-badge [status]="r.criticidade" />
                  </td>
                </ng-container>
                <ng-container matColumnDef="prazo">
                  <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main">Prazo</th>
                  <td mat-cell *matCellDef="let r" class="py-3 px-4 text-red-600 font-semibold">
                    {{ r.prazo | date:'dd/MM/yyyy' }}
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['descricao', 'criticidade', 'prazo']; sticky: true"></tr>
                <tr mat-row *matRowDef="let row; columns: ['descricao', 'criticidade', 'prazo'];"></tr>
              </table>
            </div>
          </mat-card-content>
        </mat-card>
      }
    }

    @if (error) {
      <p class="text-red-600 text-center mt-4">{{ error }}</p>
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
