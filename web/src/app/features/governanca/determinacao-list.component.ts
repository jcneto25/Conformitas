import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { RegistroFraudeListComponent } from './registro-fraude-list.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-determinacao-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatButtonModule,
    MatIconModule, MatChipsModule, MatProgressSpinnerModule, MatCardModule,
    MatTabsModule, RegistroFraudeListComponent,
  ],
  template: `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-text-main m-0">Governança e Transparência</h1>
      <button mat-flat-button color="primary" routerLink="/governanca/novo">
        <mat-icon aria-hidden="true">add</mat-icon> Nova Determinação
      </button>
    </div>

    @if (loading) {
      <div class="flex justify-center py-12"><mat-spinner diameter="40" /></div>
    } @else {
      <mat-tab-group (selectedTabChange)="abaAtiva = $event.index">
        <!-- Aba: Determinações Externas -->
        <mat-tab label="Determinações Externas (TCE/CNJ)">
          <mat-card class="!shadow-sm !rounded-lg mt-4">
            <mat-card-content>
              <table mat-table [dataSource]="determinacoes" class="w-full">
                <ng-container matColumnDef="orgao">
                  <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Órgão</th>
                  <td mat-cell *matCellDef="let d">
                    <mat-chip class="!h-6 text-xs"
                      [class]="d.orgao === 'TCE' ? 'bg-red-100 text-red-800' :
                               d.orgao === 'CNJ' ? 'bg-blue-100 text-blue-800' :
                               'bg-gray-100 text-gray-800'">
                      {{ d.orgao }}
                    </mat-chip>
                  </td>
                </ng-container>
                <ng-container matColumnDef="numero">
                  <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Número</th>
                  <td mat-cell *matCellDef="let d">{{ d.numero }}</td>
                </ng-container>
                <ng-container matColumnDef="descricao">
                  <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Descrição</th>
                  <td mat-cell *matCellDef="let d" class="max-w-xs truncate">{{ d.descricao }}</td>
                </ng-container>
                <ng-container matColumnDef="prazo">
                  <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Prazo</th>
                  <td mat-cell *matCellDef="let d">{{ d.prazoResposta ? (d.prazoResposta | date:'dd/MM/yyyy') : '—' }}</td>
                </ng-container>
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Status</th>
                  <td mat-cell *matCellDef="let d">
                    <mat-chip class="!h-6 text-xs"
                      [class]="d.status === 'CONCLUIDA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                      {{ d.status }}
                    </mat-chip>
                  </td>
                </ng-container>
                <ng-container matColumnDef="acoes">
                  <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium w-32">Ações</th>
                  <td mat-cell *matCellDef="let d">
                    @if (d.status === 'PENDENTE') {
                      <button mat-stroked-button size="small" (click)="concluir(d.id)"
                              [disabled]="concluindoId === d.id">
                        Concluir
                      </button>
                    }
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['orgao', 'numero', 'descricao', 'prazo', 'status', 'acoes']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['orgao', 'numero', 'descricao', 'prazo', 'status', 'acoes']"></tr>
              </table>
              @if (determinacoes.length === 0) {
                <div class="text-center py-8 text-text-sec">Nenhuma determinação externa registrada.</div>
              }
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <!-- Aba: Registros de Fraude -->
        <mat-tab label="Registros de Fraude">
          <app-registro-fraude-list class="block mt-4" />
        </mat-tab>
      </mat-tab-group>

      @if (error) {
        <div class="flex items-center gap-2 text-red-600 text-sm mt-4 p-3 bg-red-50 rounded-lg border border-red-100" role="alert">
          <span>{{ error }}</span>
        </div>
      }
    }
  `,
})
export class DeterminacaoListComponent implements OnInit {
  private readonly http = inject(HttpClient);

  abaAtiva = 0;
  determinacoes: any[] = [];
  loading = true;
  error = '';
  concluindoId = '';

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    this.loading = true;
    this.error = '';
    try {
      this.determinacoes = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/determinacoes-externas`),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar determinações';
    } finally {
      this.loading = false;
    }
  }

  async concluir(id: string) {
    this.concluindoId = id;
    this.error = '';
    try {
      await firstValueFrom(this.http.post(
        `${environment.apiUrl}/determinacoes-externas/${id}/concluir`, {},
      ));
      await this.carregar();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao concluir determinação';
    } finally {
      this.concluindoId = '';
    }
  }
}
