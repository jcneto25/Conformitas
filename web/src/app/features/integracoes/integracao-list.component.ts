import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

const STATUS_COLOR: Record<string, string> = {
  ATIVA: 'bg-green-100 text-green-800',
  INATIVA: 'bg-gray-100 text-gray-600',
  EM_CONFIGURACAO: 'bg-yellow-100 text-yellow-800',
  ERRO: 'bg-red-100 text-red-800',
};
const HEALTH_COLOR: Record<string, string> = {
  ONLINE: 'bg-green-100 text-green-800',
  OFFLINE: 'bg-red-100 text-red-800',
  ERRO: 'bg-red-100 text-red-800',
  NAO_TESTADO: 'bg-gray-100 text-gray-600',
};

@Component({
  selector: 'app-integracao-list',
  standalone: true,
  imports: [
    MatCardModule, MatProgressSpinnerModule, MatIconModule,
    MatButtonModule, MatTableModule, MatChipsModule, RouterModule,
    PageHeaderComponent, EmptyStateComponent,
  ],
  template: `
    <app-page-header title="Catálogo de Integrações">
      <button mat-raised-button color="primary" routerLink="/integracoes/novo">
        <mat-icon>add</mat-icon> Nova Integração
      </button>
    </app-page-header>

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
    } @else {
      <div class="mb-4">
        <button mat-stroked-button (click)="healthAll()" [disabled]="checkingHealth">
          <mat-icon>monitor_heart</mat-icon> {{ checkingHealth ? 'Verificando...' : 'Health Check Geral' }}
        </button>
      </div>

      @if (integracoes.length === 0) {
        <mat-card class="shadow-sm rounded-xl">
          <mat-card-content>
            <app-empty-state icon="link_off" title="Nenhuma integração cadastrada" description="Cadastre integrações para conectar o sistema a outras plataformas.">
              <button mat-raised-button color="primary" routerLink="/integracoes/novo">
                Cadastrar Primeira Integração
              </button>
            </app-empty-state>
          </mat-card-content>
        </mat-card>
      } @else {
        <mat-card class="shadow-sm rounded-xl overflow-hidden">
          <table mat-table [dataSource]="integracoes" class="w-full">
            <ng-container matColumnDef="nome">
              <th mat-header-cell *matHeaderCellDef>Nome</th>
              <td mat-cell *matCellDef="let i">
                <a [routerLink]="['/integracoes', i.id]" class="text-blue-600 hover:underline font-medium">{{ i.nome }}</a>
              </td>
            </ng-container>
            <ng-container matColumnDef="sistemaExterno">
              <th mat-header-cell *matHeaderCellDef>Sistema</th>
              <td mat-cell *matCellDef="let i">{{ i.sistemaExterno }}</td>
            </ng-container>
            <ng-container matColumnDef="protocolo">
              <th mat-header-cell *matHeaderCellDef>Protocolo</th>
              <td mat-cell *matCellDef="let i">{{ i.protocolo }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let i">
                <span class="px-2 py-0.5 rounded-full text-xs font-medium {{ statusColor(i.status) }}">
                  {{ i.status }}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="healthStatus">
              <th mat-header-cell *matHeaderCellDef>Saúde</th>
              <td mat-cell *matCellDef="let i">
                <span class="px-2 py-0.5 rounded-full text-xs font-medium {{ healthColor(i.healthStatus) }}">
                  {{ i.healthStatus || 'N/A' }}
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="colunas; sticky: true"></tr>
            <tr mat-row *matRowDef="let row; columns: colunas;"></tr>
          </table>
        </mat-card>
      }
    }
  `,
})
export class IntegracaoListComponent implements OnInit {
  integracoes: any[] = [];
  loading = true;
  error = '';
  checkingHealth = false;
  colunas = ['nome', 'sistemaExterno', 'protocolo', 'status', 'healthStatus'];

  constructor(private readonly api: ApiService) {}

  async ngOnInit() {
    this.error = '';
    this.loading = true;
    try { this.integracoes = await this.api.getIntegracoes(); }
    catch { this.error = 'Erro ao carregar integrações'; this.integracoes = []; }
    finally { this.loading = false; }
  }

  async healthAll() {
    this.checkingHealth = true;
    try {
      this.integracoes = await this.api.healthAllIntegracoes();
    } catch { /* ignore */ }
    finally { this.checkingHealth = false; }
  }

  statusColor(s: string) { return STATUS_COLOR[s] ?? 'bg-gray-100'; }
  healthColor(s: string) { return HEALTH_COLOR[s] ?? 'bg-gray-100'; }
}
