import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../core/services/api.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

const STATUS_COLOR: Record<string, string> = {
  RECEBIDA: 'bg-blue-100 text-blue-800',
  EM_ANALISE: 'bg-yellow-100 text-yellow-800',
  EM_EXECUCAO: 'bg-purple-100 text-purple-800',
  CONCLUIDA: 'bg-green-100 text-green-800',
  REPORTADA: 'bg-teal-100 text-teal-800',
};

@Component({
  selector: 'app-acao-coordenada-list',
  standalone: true,
  imports: [
    MatCardModule, MatProgressSpinnerModule, MatIconModule,
    MatButtonModule, MatTableModule, MatChipsModule, RouterModule,
    PageHeaderComponent, DatePipe, EmptyStateComponent,
  ],
  template: `
    <app-page-header title="Ações Coordenadas SIAUD-Jud" />

    @if (loading) {
      <div class="flex justify-center py-12"><mat-spinner diameter="40" /></div>
    } @else if (error) {
      <mat-card class="shadow-sm rounded-xl border border-red-100">
        <mat-card-content class="flex items-center gap-2 text-red-600 p-6">
          <mat-icon>error_outline</mat-icon>
          <span>{{ error }}</span>
          <button mat-button color="primary" (click)="ngOnInit()" class="ml-auto">Tentar novamente</button>
        </mat-card-content>
      </mat-card>
    } @else if (acoes.length === 0) {
      <mat-card class="shadow-sm rounded-xl">
        <mat-card-content>
          <app-empty-state icon="handshake" title="Nenhuma Ação Coordenada recebida" description="Aguardando recebimento de ações coordenadas via SIAUD-Jud." />
        </mat-card-content>
      </mat-card>
    } @else {
      <mat-card class="shadow-sm rounded-xl overflow-hidden">
        <table mat-table [dataSource]="acoes" class="w-full">
          <ng-container matColumnDef="codigoSiaud">
            <th mat-header-cell *matHeaderCellDef>Código SIAUD</th>
            <td mat-cell *matCellDef="let a" class="font-mono text-sm">{{ a.codigoSiaud }}</td>
          </ng-container>
          <ng-container matColumnDef="titulo">
            <th mat-header-cell *matHeaderCellDef>Título</th>
            <td mat-cell *matCellDef="let a">
              <a [routerLink]="['/acoes-coordenadas', a.id]" class="text-blue-600 hover:underline font-medium">{{ a.titulo }}</a>
            </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let a">
              <span class="px-2 py-0.5 rounded-full text-xs font-medium {{ statusColor(a.status) }}">
                {{ a.status }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="prazoExecucao">
            <th mat-header-cell *matHeaderCellDef>Prazo</th>
            <td mat-cell *matCellDef="let a">{{ a.prazoExecucao ? (a.prazoExecucao | date:'shortDate') : '—' }}</td>
          </ng-container>
          <ng-container matColumnDef="resultadoReportado">
            <th mat-header-cell *matHeaderCellDef>Reportado</th>
            <td mat-cell *matCellDef="let a">
              <mat-icon class="text-sm">{{ a.resultadoReportado ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="colunas; sticky: true"></tr>
          <tr mat-row *matRowDef="let row; columns: colunas;"></tr>
        </table>
      </mat-card>
    }
  `,
})
export class AcaoCoordenadaListComponent implements OnInit {
  acoes: any[] = [];
  loading = true;
  error = '';
  colunas = ['codigoSiaud', 'titulo', 'status', 'prazoExecucao', 'resultadoReportado'];

  constructor(private readonly api: ApiService) {}

  async ngOnInit() {
    this.error = '';
    this.loading = true;
    try { this.acoes = await this.api.getAcoesCoordenadas(); }
    catch { this.error = 'Erro ao carregar ações coordenadas'; this.acoes = []; }
    finally { this.loading = false; }
  }

  statusColor(s: string) { return STATUS_COLOR[s] ?? 'bg-gray-100'; }
}
