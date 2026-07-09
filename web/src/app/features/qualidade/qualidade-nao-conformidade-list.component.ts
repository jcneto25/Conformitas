import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-qualidade-nao-conformidade-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule,
  ],
  template: `
    <div>
      <table mat-table [dataSource]="naoConformidades" class="w-full">
        <ng-container matColumnDef="descricao">
          <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Descrição</th>
          <td mat-cell *matCellDef="let nc">{{ nc.descricao }}</td>
        </ng-container>

        <ng-container matColumnDef="severidade">
          <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Severidade</th>
          <td mat-cell *matCellDef="let nc">
            <mat-chip class="!h-6 text-xs"
              [class]="nc.severidade === 'CRITICA' ? 'bg-red-100 text-red-800' :
                       nc.severidade === 'ALTA' ? 'bg-orange-100 text-orange-800' :
                       nc.severidade === 'MEDIA' ? 'bg-yellow-100 text-yellow-800' :
                       'bg-gray-100 text-gray-800'">
              {{ nc.severidade }}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Status</th>
          <td mat-cell *matCellDef="let nc">
            <mat-chip class="!h-6 text-xs"
              [class]="nc.status === 'CORRIGIDA' ? 'bg-green-100 text-green-800' :
                       nc.status === 'EM_CORRECAO' ? 'bg-blue-100 text-blue-800' :
                       'bg-gray-100 text-gray-800'">
              {{ nc.status }}
            </mat-chip>
          </td>
        </ng-container>

        <ng-container matColumnDef="acao">
          <th mat-header-cell *matHeaderCellDef class="text-text-sec font-medium">Ação</th>
          <td mat-cell *matCellDef="let nc">
            @if (nc.status === 'ABERTA') {
              <button mat-stroked-button size="small" (click)="abrirAcaoCorretiva(nc)">
                Ação Corretiva
              </button>
            } @else if (nc.status === 'EM_CORRECAO') {
              <button mat-stroked-button size="small" color="primary"
                      (click)="concluirNc(nc.id)" [disabled]="concluindoId === nc.id">
                Concluir
              </button>
            }
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="['descricao', 'severidade', 'status', 'acao']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['descricao', 'severidade', 'status', 'acao']"></tr>
      </table>

      @if (naoConformidades.length === 0) {
        <div class="text-center py-4 text-text-sec text-sm">Nenhuma não conformidade registrada.</div>
      }

      <!-- Formulário de nova NC -->
      <div class="flex items-end gap-3 mt-3 p-3 bg-gray-50 rounded-lg">
        <mat-form-field appearance="outline" class="flex-1">
          <mat-label>Nova não conformidade</mat-label>
          <input matInput [(ngModel)]="novaDescricao" name="novaDescricao">
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-32">
          <mat-label>Severidade</mat-label>
          <mat-select [(ngModel)]="novaSeveridade" name="novaSeveridade">
            <mat-option value="BAIXA">Baixa</mat-option>
            <mat-option value="MEDIA">Média</mat-option>
            <mat-option value="ALTA">Alta</mat-option>
            <mat-option value="CRITICA">Crítica</mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-flat-button color="primary" (click)="criarNc()"
                [disabled]="!novaDescricao || !novaSeveridade || criandoNc">
          {{ criandoNc ? '...' : 'Adicionar' }}
        </button>
      </div>

      <!-- Ação corretiva inline -->
      @if (ncAcaoCorretiva) {
        <div class="flex items-end gap-3 mt-3 p-3 bg-blue-50 rounded-lg">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Ação corretiva para {{ ncAcaoCorretiva.descricao }}</mat-label>
            <input matInput [(ngModel)]="acaoCorretivaTexto" name="acaoCorretivaTexto">
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="salvarAcaoCorretiva()"
                  [disabled]="!acaoCorretivaTexto || salvandoAcao">
            {{ salvandoAcao ? '...' : 'Salvar' }}
          </button>
          <button mat-button (click)="cancelarAcaoCorretiva()">Cancelar</button>
        </div>
      }

      @if (error) {
        <div class="text-critical text-sm mt-2">{{ error }}</div>
      }
    </div>
  `,
})
export class QualidadeNaoConformidadeListComponent implements OnInit {
  private readonly http = inject(HttpClient);

  @Input() avaliacaoId = '';
  @Output() ncsAtualizadas = new EventEmitter<void>();

  naoConformidades: any[] = [];
  novaDescricao = '';
  novaSeveridade = '';
  criandoNc = false;
  ncAcaoCorretiva: any = null;
  acaoCorretivaTexto = '';
  salvandoAcao = false;
  concluindoId = '';
  error = '';

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    try {
      this.naoConformidades = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/qualidade/nao-conformidades?avaliacaoId=${this.avaliacaoId}`),
      );
    } catch {
      this.naoConformidades = [];
    }
  }

  async criarNc() {
    if (!this.novaDescricao || !this.novaSeveridade) return;
    this.criandoNc = true;
    this.error = '';
    try {
      await firstValueFrom(this.http.post(
        `${environment.apiUrl}/qualidade/avaliacoes/${this.avaliacaoId}/nao-conformidades`,
        { descricao: this.novaDescricao, severidade: this.novaSeveridade },
      ));
      this.novaDescricao = '';
      this.novaSeveridade = '';
      await this.carregar();
      this.ncsAtualizadas.emit();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao criar não conformidade';
    } finally {
      this.criandoNc = false;
    }
  }

  abrirAcaoCorretiva(nc: any) {
    this.ncAcaoCorretiva = nc;
    this.acaoCorretivaTexto = '';
  }

  cancelarAcaoCorretiva() {
    this.ncAcaoCorretiva = null;
    this.acaoCorretivaTexto = '';
  }

  async salvarAcaoCorretiva() {
    if (!this.acaoCorretivaTexto || !this.ncAcaoCorretiva) return;
    this.salvandoAcao = true;
    this.error = '';
    try {
      await firstValueFrom(this.http.put(
        `${environment.apiUrl}/qualidade/nao-conformidades/${this.ncAcaoCorretiva.id}/acao-corretiva`,
        { acaoCorretiva: this.acaoCorretivaTexto },
      ));
      this.ncAcaoCorretiva = null;
      this.acaoCorretivaTexto = '';
      await this.carregar();
      this.ncsAtualizadas.emit();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao registrar ação corretiva';
    } finally {
      this.salvandoAcao = false;
    }
  }

  async concluirNc(id: string) {
    this.concluindoId = id;
    this.error = '';
    try {
      await firstValueFrom(this.http.post(
        `${environment.apiUrl}/qualidade/nao-conformidades/${id}/concluir`, {},
      ));
      await this.carregar();
      this.ncsAtualizadas.emit();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao concluir não conformidade';
    } finally {
      this.concluindoId = '';
    }
  }
}
