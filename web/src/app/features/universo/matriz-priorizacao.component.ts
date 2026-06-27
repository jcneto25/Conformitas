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
import { MatSortModule, Sort } from '@angular/material/sort';

const API = 'http://localhost:3001/api/v1';

interface ItemUniverso {
  id: string;
  nome: string;
  descricao?: string;
  tipo: string;
  unidadeResponsavel: string;
  materialidade: number;
  relevancia: number;
  criticidade: number;
  risco: number;
  indicePriorizacao: number | null;
}

@Component({
  selector: 'app-matriz-priorizacao',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSortModule,
  ],
  template: `
    <h1>Matriz de Priorização</h1>

    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content>
        <p style="margin: 0; color: #666;">
          Itens do universo auditável ordenados por índice de priorização (materialidade × relevância × criticidade / risco).
          Destaques em verde indicam os itens recomendados dentro das horas disponíveis.
        </p>
      </mat-card-content>
    </mat-card>

    <!-- Filtro horas -->
    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content>
        <form (ngSubmit)="carregar()" style="display: flex; gap: 1rem; align-items: flex-end;">
          <mat-form-field appearance="outline" style="min-width: 250px;">
            <mat-label>Horas Disponíveis</mat-label>
            <input matInput type="number" [(ngModel)]="horasDisponiveis" name="horas"
                   placeholder="Ex: 400" min="0" />
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit">
            Aplicar
          </button>
        </form>
      </mat-card-content>
    </mat-card>

    <!-- Tabela -->
    <mat-card>
      <mat-card-content>
        <table mat-table [dataSource]="itens" matSort
               (matSortChange)="sortData($event)" class="mat-elevation-z0" style="width: 100%;">

          <ng-container matColumnDef="indicePriorizacao">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Índice</th>
            <td mat-cell *matCellDef="let i">
              <strong
                [style.color]="destaques.has(i.id) ? '#2e7d32' : 'inherit'"
                [style.fontWeight]="destaques.has(i.id) ? '700' : '500'">
                {{ i.indicePriorizacao | number:'1.2-2' }}
              </strong>
            </td>
          </ng-container>

          <ng-container matColumnDef="nome">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Nome</th>
            <td mat-cell *matCellDef="let i">
              <span [style.color]="destaques.has(i.id) ? '#2e7d32' : 'inherit'">
                {{ i.nome }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="tipo">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let i">{{ i.tipo }}</td>
          </ng-container>

          <ng-container matColumnDef="unidadeResponsavel">
            <th mat-header-cell *matHeaderCellDef>Unidade</th>
            <td mat-cell *matCellDef="let i">{{ i.unidadeResponsavel }}</td>
          </ng-container>

          <ng-container matColumnDef="materialidade">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Mat.</th>
            <td mat-cell *matCellDef="let i" style="text-align: center;">{{ i.materialidade }}</td>
          </ng-container>

          <ng-container matColumnDef="relevancia">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Rel.</th>
            <td mat-cell *matCellDef="let i" style="text-align: center;">{{ i.relevancia }}</td>
          </ng-container>

          <ng-container matColumnDef="criticidade">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Cri.</th>
            <td mat-cell *matCellDef="let i" style="text-align: center;">{{ i.criticidade }}</td>
          </ng-container>

          <ng-container matColumnDef="risco">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Risco</th>
            <td mat-cell *matCellDef="let i" style="text-align: center;">{{ i.risco }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"
              [style.backgroundColor]="destaques.has(row.id) ? '#e8f5e9' : 'transparent'"></tr>
        </table>

        <p *ngIf="!itens.length && !error" style="text-align: center; color: #999; padding: 2rem;">
          Nenhum item no universo auditável.
        </p>

        <p *ngIf="error" style="color: #c62828; text-align: center; margin-top: 1rem;">{{ error }}</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class MatrizPriorizacaoComponent implements OnInit {
  itens: ItemUniverso[] = [];
  destaques: Set<string> = new Set();
  horasDisponiveis = '';
  error = '';
  columns = ['indicePriorizacao', 'nome', 'tipo', 'unidadeResponsavel',
             'materialidade', 'relevancia', 'criticidade', 'risco'];

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    this.error = '';
    try {
      const params: any = {};
      if (this.horasDisponiveis) {
        params.horas_disponiveis = this.horasDisponiveis;
      }
      const response = await firstValueFrom(
        this.http.get<{ itens: ItemUniverso[]; destaques: string[] }>(
          `${API}/universo-auditavel/matriz-priorizacao`,
          { params },
        ),
      );
      this.itens = response.itens;
      this.destaques = new Set(response.destaques);
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar matriz de priorização';
    }
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.itens = [...this.itens].sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      const key = sort.active as keyof ItemUniverso;
      return this.compare(a[key], b[key], isAsc);
    });
  }

  private compare(a: any, b: any, isAsc: boolean): number {
    if (a == null) return 1;
    if (b == null) return -1;
    if (typeof a === 'number' && typeof b === 'number') {
      return (a - b) * (isAsc ? 1 : -1);
    }
    return String(a).localeCompare(String(b)) * (isAsc ? 1 : -1);
  }
}
