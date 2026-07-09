import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-registro-fraude-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatProgressSpinnerModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
  ],
  template: `
    <mat-card class="!shadow-sm !rounded-lg">
      <mat-card-content>
        <table mat-table [dataSource]="fraudes" class="w-full">
          <ng-container matColumnDef="descricao">
            <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Descrição</th>
            <td mat-cell *matCellDef="let f" class="max-w-xs truncate">{{ f.descricao }}</td>
          </ng-container>

          <ng-container matColumnDef="classificacao">
            <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Classificação</th>
            <td mat-cell *matCellDef="let f">
              <mat-chip class="!h-6 text-xs"
                [class]="f.classificacao === 'CONFIRMADA' ? 'bg-red-100 text-red-800' :
                         f.classificacao === 'SUSPEITA' ? 'bg-orange-100 text-orange-800' :
                         'bg-gray-100 text-gray-800'">
                {{ f.classificacao }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="superior">
            <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Comunicado Superior</th>
            <td mat-cell *matCellDef="let f">
              {{ f.dataComunicacaoSuperior ? (f.dataComunicacaoSuperior | date:'dd/MM/yyyy') : '—' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="tce">
            <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Comunicado TCE</th>
            <td mat-cell *matCellDef="let f">
              {{ f.dataComunicacaoTce ? (f.dataComunicacaoTce | date:'dd/MM/yyyy') : '—' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium w-48">Ações</th>
            <td mat-cell *matCellDef="let f">
              <div class="flex gap-1">
                @if (!f.dataComunicacaoSuperior) {
                  <button mat-stroked-button size="small" (click)="comunicar(f.id, 'SUPERIOR')"
                          [disabled]="comunicandoId === f.id">
                    Comunicar Superior
                  </button>
                }
                @if (f.dataComunicacaoSuperior && !f.dataComunicacaoTce) {
                  <button mat-stroked-button size="small" color="primary"
                          (click)="comunicar(f.id, 'TCE')"
                          [disabled]="comunicandoId === f.id">
                    Comunicar TCE
                  </button>
                }
                @if (f.dataComunicacaoSuperior && f.dataComunicacaoTce) {
                  <span class="text-green-600 text-sm flex items-center gap-1">
                    <mat-icon class="text-sm">check_circle</mat-icon> Concluído
                  </span>
                }
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="['descricao', 'classificacao', 'superior', 'tce', 'acoes']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['descricao', 'classificacao', 'superior', 'tce', 'acoes']"></tr>
        </table>

        @if (fraudes.length === 0) {
          <div class="text-center py-8 text-text-sec">Nenhum registro de fraude.</div>
        }

        <!-- Formulário: novo registro de fraude -->
        <div class="flex items-end gap-3 mt-4 p-3 bg-gray-50 rounded-lg">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Descrição do indício</mat-label>
            <input matInput [(ngModel)]="novaDescricao" name="novaDescricao">
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-36">
            <mat-label>Classificação</mat-label>
            <mat-select [(ngModel)]="novaClassificacao" name="novaClassificacao">
              <mat-option value="SUSPEITA">Suspeita</mat-option>
              <mat-option value="CONFIRMADA">Confirmada</mat-option>
              <mat-option value="DESCARTADA">Descartada</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="criar()"
                  [disabled]="!novaDescricao || !novaClassificacao || criando" class="min-w-[120px]">
            @if (criando) { <mat-spinner diameter="18" class="inline-block" /> }
            {{ criando ? 'Registrando...' : 'Registrar' }}
          </button>
        </div>

        @if (error) {
          <div class="text-critical text-sm mt-2">{{ error }}</div>
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class RegistroFraudeListComponent implements OnInit {
  private readonly http = inject(HttpClient);

  fraudes: any[] = [];
  novaDescricao = '';
  novaClassificacao = '';
  criando = false;
  comunicandoId = '';
  error = '';

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    try {
      this.fraudes = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/registros-fraude`),
      );
    } catch {
      this.fraudes = [];
    }
  }

  async criar() {
    if (!this.novaDescricao || !this.novaClassificacao) return;
    this.criando = true;
    this.error = '';
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/registros-fraude`, {
        descricao: this.novaDescricao,
        classificacao: this.novaClassificacao,
      }));
      this.novaDescricao = '';
      this.novaClassificacao = '';
      await this.carregar();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao registrar fraude';
    } finally {
      this.criando = false;
    }
  }

  async comunicar(id: string, tipo: string) {
    this.comunicandoId = id;
    this.error = '';
    try {
      await firstValueFrom(this.http.post(
        `${environment.apiUrl}/registros-fraude/${id}/comunicar`, { tipo },
      ));
      await this.carregar();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao comunicar fraude';
    } finally {
      this.comunicandoId = '';
    }
  }
}
