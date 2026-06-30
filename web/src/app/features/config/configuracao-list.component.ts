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
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({
  selector: 'app-configuracao-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, PageHeaderComponent,
  ],
  template: `
    <app-page-header title="Configurações do Sistema" />

    <mat-card class="mb-4">
      <mat-card-content>
        <p class="m-0 text-text-sec">
          Configurações globais do sistema. Apenas perfis P10 podem visualizar e editar.
        </p>
      </mat-card-content>
    </mat-card>

    @if (loading) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="40" />
      </div>
    } @else if (error) {
      <mat-card>
        <mat-card-content class="text-critical text-center">{{ error }}</mat-card-content>
      </mat-card>
    } @else if (!configs.length) {
      <mat-card>
        <mat-card-content class="text-center py-8 text-text-sec">Nenhuma configuração encontrada.</mat-card-content>
      </mat-card>
    } @else {
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="configs" class="mat-elevation-z0 w-full">

            <ng-container matColumnDef="chave">
              <th mat-header-cell *matHeaderCellDef>Chave</th>
              <td mat-cell *matCellDef="let c">
                <strong>{{ c.chave }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="valor">
              <th mat-header-cell *matHeaderCellDef>Valor</th>
              <td mat-cell *matCellDef="let c">
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
              <th mat-header-cell *matHeaderCellDef>Descrição</th>
              <td mat-cell *matCellDef="let c">{{ c.descricao }}</td>
            </ng-container>

            <ng-container matColumnDef="acoes">
              <th mat-header-cell *matHeaderCellDef>Ações</th>
              <td mat-cell *matCellDef="let c">
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

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>

          @if (saveSuccess) {
            <p class="text-success text-center mt-4">{{ saveSuccess }}</p>
          }
        </mat-card-content>
      </mat-card>
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
