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
import { QualidadeNaoConformidadeListComponent } from './qualidade-nao-conformidade-list.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-qualidade-avaliacao-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatButtonModule,
    MatIconModule, MatChipsModule, MatProgressSpinnerModule, MatCardModule,
    QualidadeNaoConformidadeListComponent,
  ],
  template: `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-text-main m-0">Qualidade / PQAUD</h1>
      <button mat-flat-button color="primary" routerLink="/qualidade/novo">
        <mat-icon aria-hidden="true">add</mat-icon> Nova Avaliação
      </button>
    </div>

    @if (loading) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="40" />
      </div>
    } @else {
      <!-- Indicadores -->
      @if (indicadores.length > 0) {
        <section class="mb-6">
          <h2 class="text-lg font-semibold text-text-main mb-3">Indicadores de Qualidade</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            @for (ind of indicadores; track ind.id) {
              <mat-card class="!shadow-sm !rounded-lg">
                <mat-card-content class="p-4">
                  <div class="text-sm text-text-sec">{{ ind.nome }}</div>
                  <div class="text-2xl font-bold mt-1"
                       [class.text-green-600]="ind.meta && ind.valorAtual >= ind.meta"
                       [class.text-orange-600]="ind.meta && ind.valorAtual < ind.meta"
                       [class.text-gray-400]="!ind.valorAtual">
                    {{ ind.valorAtual != null ? ind.valorAtual + '%' : '—' }}
                  </div>
                  @if (ind.meta) {
                    <div class="text-xs text-text-sec mt-1">Meta: {{ ind.meta }}%</div>
                  }
                  <div class="text-xs text-text-sec mt-1">{{ ind.periodicidade }}</div>
                </mat-card-content>
              </mat-card>
            }
          </div>
        </section>
      }

      <!-- Tabela de Avaliações -->
      <mat-card class="!shadow-sm !rounded-lg">
        <mat-card-content>
          <table mat-table [dataSource]="avaliacoes" class="w-full">
            <ng-container matColumnDef="tipo">
              <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Tipo</th>
              <td mat-cell *matCellDef="let a">
                <mat-chip class="!h-6 text-xs"
                  [class]="a.tipo === 'EXTERNA' ? 'bg-purple-100 text-purple-800' :
                           a.tipo === 'AUTOAVALIACAO' ? 'bg-blue-100 text-blue-800' :
                           'bg-gray-100 text-gray-800'">
                  {{ a.tipo }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="periodo">
              <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Período</th>
              <td mat-cell *matCellDef="let a">{{ a.periodoInicio | date:'dd/MM/yyyy' }} – {{ a.periodoFim | date:'dd/MM/yyyy' }}</td>
            </ng-container>

            <ng-container matColumnDef="nota">
              <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Nota</th>
              <td mat-cell *matCellDef="let a">{{ a.nota ?? '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Status</th>
              <td mat-cell *matCellDef="let a">
                <mat-chip class="!h-6 text-xs"
                  [class]="a.status === 'HOMOLOGADA' ? 'bg-green-100 text-green-800' :
                           a.status === 'CONCLUIDA' ? 'bg-blue-100 text-blue-800' :
                           'bg-gray-100 text-gray-800'">
                  {{ a.status }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="acoes">
              <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium w-40">Ações</th>
              <td mat-cell *matCellDef="let a">
                <div class="flex gap-1">
                  @if (a.status === 'RASCUNHO') {
                    <button mat-stroked-button size="small" (click)="concluir(a.id)"
                            [disabled]="concluindoId === a.id">
                      Concluir
                    </button>
                  }
                  @if (a.status === 'CONCLUIDA') {
                    <button mat-stroked-button size="small" color="primary" (click)="homologar(a.id)"
                            [disabled]="homologandoId === a.id">
                      Homologar
                    </button>
                  }
                  <button mat-stroked-button size="small" (click)="toggleNcs(a)"
                          class="!ml-1">
                    NCs ({{ a.naoConformidades?.length || 0 }})
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="colunas"></tr>
            <tr mat-row *matRowDef="let row; columns: colunas;" class="hover:bg-gray-50 cursor-pointer"
                (click)="avaliacaoExpandida = (avaliacaoExpandida?.id === row.id ? null : row)"></tr>
          </table>

          @if (avaliacoes.length === 0) {
            <div class="text-center py-8 text-text-sec">
              Nenhuma avaliação de qualidade encontrada.
            </div>
          }
        </mat-card-content>
      </mat-card>

      <!-- NCs da avaliação expandida -->
      @if (avaliacaoExpandida) {
        <mat-card class="!shadow-sm !rounded-lg mt-4">
          <mat-card-content>
            <h3 class="text-md font-semibold mb-3">
              Não Conformidades — {{ avaliacaoExpandida.tipo }}
              <span class="text-text-sec font-normal text-sm ml-2">
                ({{ avaliacaoExpandida.periodoInicio | date:'yyyy' }})
              </span>
            </h3>
            <app-qualidade-nao-conformidade-list
              [avaliacaoId]="avaliacaoExpandida.id"
              (ncsAtualizadas)="carregar()"
            />
          </mat-card-content>
        </mat-card>
      }

      @if (error) {
        <div class="flex items-center gap-2 text-critical text-sm mt-4 p-3 bg-critical-bg rounded-lg border border-critical/20" role="alert">
          <span>{{ error }}</span>
        </div>
      }
    }
  `,
})
export class QualidadeAvaliacaoListComponent implements OnInit {
  private readonly http = inject(HttpClient);

  colunas = ['tipo', 'periodo', 'nota', 'status', 'acoes'];
  avaliacoes: any[] = [];
  indicadores: any[] = [];
  avaliacaoExpandida: any = null;
  loading = true;
  error = '';
  concluindoId = '';
  homologandoId = '';

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    this.loading = true;
    this.error = '';
    try {
      const [avaliacoes, indicadores] = await Promise.all([
        firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/qualidade/avaliacoes`)),
        firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/qualidade/indicadores`)),
      ]);
      this.avaliacoes = avaliacoes;
      this.indicadores = indicadores;
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar dados de qualidade';
    } finally {
      this.loading = false;
    }
  }

  async concluir(id: string) {
    this.concluindoId = id;
    this.error = '';
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/qualidade/avaliacoes/${id}/concluir`, {}));
      await this.carregar();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao concluir avaliação';
    } finally {
      this.concluindoId = '';
    }
  }

  async homologar(id: string) {
    this.homologandoId = id;
    this.error = '';
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/qualidade/avaliacoes/${id}/homologar`, {}));
      await this.carregar();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao homologar avaliação';
    } finally {
      this.homologandoId = '';
    }
  }

  toggleNcs(a: any) {
    this.avaliacaoExpandida = this.avaliacaoExpandida?.id === a.id ? null : a;
  }

  protected readonly Date = Date;
}
