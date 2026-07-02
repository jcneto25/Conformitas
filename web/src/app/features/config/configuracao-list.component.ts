import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-configuracao-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatIconModule, PageHeaderComponent, EmptyStateComponent,
  ],
  template: `
    <app-page-header title="Configurações do Sistema" />

    <!-- Card Informativo -->
    <mat-card class="mb-6 border-l-4 border-primary shadow-sm rounded-r-xl overflow-hidden">
      <mat-card-content class="p-4 bg-slate-50/30">
        <p class="m-0 text-text-sec text-sm">
          Configurações globais do sistema. Apenas perfis P10 podem visualizar e editar.
        </p>
      </mat-card-content>
    </mat-card>

    @if (loading) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="40" />
      </div>
    } @else if (error) {
      <mat-card class="border border-red-100">
        <mat-card-content class="flex items-center gap-2 text-red-600 p-6">
          <mat-icon>error_outline</mat-icon>
          <span>{{ error }}</span>
          <button mat-button color="primary" (click)="ngOnInit()" class="ml-auto">Tentar novamente</button>
        </mat-card-content>
      </mat-card>
    } @else if (!configs.length) {
      <mat-card>
        <mat-card-content>
          <app-empty-state icon="settings" title="Nenhuma configuração encontrada" description="Não há configurações do sistema disponíveis no momento." />
        </mat-card-content>
      </mat-card>
    } @else {
      <div class="shadow-sm rounded-xl overflow-hidden border border-gray-100 bg-white">
        <table mat-table [dataSource]="configs" class="mat-elevation-z0 w-full">

          <ng-container matColumnDef="chave">
            <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main">Chave</th>
            <td mat-cell *matCellDef="let c" class="py-3 font-medium text-text-main">
              <strong>{{ c.chave }}</strong>
            </td>
          </ng-container>

          <ng-container matColumnDef="valor">
            <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main">Valor</th>
            <td mat-cell *matCellDef="let c" class="py-3 pr-4 text-gray-700">
              @if (editing[c.chave]) {
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Valor</mat-label>
                  <input matInput [(ngModel)]="editValues[c.chave]" />
                </mat-form-field>
              } @else {
                {{ c.valor }}
              }
            </td>
          </ng-container>

          <ng-container matColumnDef="descricao">
            <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main">Descrição</th>
            <td mat-cell *matCellDef="let c" class="py-3 pr-4 max-w-md truncate text-gray-700">{{ c.descricao }}</td>
          </ng-container>

          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[160px]">Ações</th>
            <td mat-cell *matCellDef="let c" class="py-3">
              @if (c.editavel) {
                @if (editing[c.chave]) {
                  <button mat-stroked-button color="primary" (click)="salvar(c.chave)">
                    Salvar
                  </button>
                  <button mat-button (click)="cancelar(c.chave)" class="ml-2">
                    Cancelar
                  </button>
                } @else {
                  <button mat-stroked-button (click)="editar(c)">
                    Editar
                  </button>
                }
              } @else {
                <span class="text-text-sec">Não editável</span>
              }
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns; sticky: true"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </div>

      @if (saveSuccess) {
        <p class="text-green-700 text-center mt-4">{{ saveSuccess }}</p>
      }
    }
  `,
})
export class ConfiguracaoListComponent implements OnInit {
  configs: any[] = [];
  error = '';
  saveSuccess = '';
  loading = true;
  columns = ['chave', 'valor', 'descricao', 'acoes'];
  editing: Record<string, boolean> = {};
  editValues: Record<string, string> = {};

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    try {
      this.loading = true;
      this.configs = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/configuracoes`),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar configurações';
    } finally {
      this.loading = false;
    }
  }

  editar(config: any) {
    this.editing[config.chave] = true;
    this.editValues[config.chave] = config.valor;
  }

  cancelar(chave: string) {
    this.editing[chave] = false;
  }

  async salvar(chave: string) {
    this.error = '';
    this.saveSuccess = '';
    try {
      const config = await firstValueFrom(
        this.http.put<any>(`${environment.apiUrl}/configuracoes/${chave}`, {
          valor: this.editValues[chave],
        }),
      );
      const idx = this.configs.findIndex(c => c.chave === chave);
      if (idx >= 0) {
        this.configs[idx] = config;
      }
      this.editing[chave] = false;
      this.saveSuccess = `Configuração "${chave}" atualizada`;
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao salvar configuração';
    }
  }
}
