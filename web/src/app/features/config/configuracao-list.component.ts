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

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-configuracao-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule,
  ],
  template: `
    <h1>Configurações do Sistema</h1>

    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content>
        <p style="margin: 0; color: #666;">
          Configurações globais do sistema. Apenas perfis P10 podem visualizar e editar.
        </p>
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-content>
        <table mat-table [dataSource]="configs" class="mat-elevation-z0" style="width: 100%;">

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
                <mat-form-field appearance="outline" style="width: 100%;">
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
                  <button mat-button (click)="cancelar(c.chave)" style="margin-left: 0.5rem;">
                    Cancelar
                  </button>
                } @else {
                  <button mat-stroked-button (click)="editar(c)">
                    Editar
                  </button>
                }
              } @else {
                <span style="color: #999;">Não editável</span>
              }
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>

        <p *ngIf="!configs.length && !error" style="text-align: center; color: #999; padding: 2rem;">
          Nenhuma configuração encontrada.
        </p>

        <p *ngIf="error" style="color: #c62828; text-align: center;">{{ error }}</p>
        <p *ngIf="saveSuccess" style="color: #2e7d32; text-align: center; margin-top: 1rem;">{{ saveSuccess }}</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class ConfiguracaoListComponent implements OnInit {
  configs: any[] = [];
  error = '';
  saveSuccess = '';
  columns = ['chave', 'valor', 'descricao', 'acoes'];
  editing: Record<string, boolean> = {};
  editValues: Record<string, string> = {};

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    try {
      this.configs = await firstValueFrom(
        this.http.get<any[]>(`${API}/configuracoes`),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar configurações';
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
        this.http.put<any>(`${API}/configuracoes/${chave}`, {
          valor: this.editValues[chave],
        }),
      );
      // Update local state
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
