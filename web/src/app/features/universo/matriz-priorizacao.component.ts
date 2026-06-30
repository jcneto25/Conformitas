import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table.component';

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
    MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSortModule, PageHeaderComponent, DataTableComponent,
  ],
  template: `
    <app-page-header title="Matriz de Priorização" />

    <mat-card class="mb-4">
      <mat-card-content>
        <p class="m-0 text-text-sec">
          Itens do universo auditável ordenados por índice de priorização (materialidade × relevância × criticidade / risco).
          Destaques em verde indicam os itens recomendados dentro das horas disponíveis.
        </p>
      </mat-card-content>
    </mat-card>

    <mat-card class="mb-4">
      <mat-card-content>
        <form (ngSubmit)="carregar()" class="flex gap-4 items-end">
          <mat-form-field appearance="outline" class="min-w-[250px]">
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

    <app-data-table
      [data]="itens"
      [displayedColumns]="columns"
      [loading]="loading"
      [error]="error"
      (retry)="ngOnInit()"
      emptyMessage="Nenhum item no universo auditável.">
      <ng-template #tableBody>
        <ng-container matColumnDef="indicePriorizacao">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Índice</th>
          <td mat-cell *matCellDef="let i">
            <strong
              [class.text-success]="destaques.has(i.id)"
              [class.font-bold]="destaques.has(i.id)"
              [class.font-medium]="!destaques.has(i.id)">
              {{ i.indicePriorizacao | number:'1.2-2' }}
            </strong>
          </td>
        </ng-container>

        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Nome</th>
          <td mat-cell *matCellDef="let i">
            <span [class.text-success]="destaques.has(i.id)">
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
          <td mat-cell *matCellDef="let i" class="text-center">{{ i.materialidade }}</td>
        </ng-container>

        <ng-container matColumnDef="relevancia">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Rel.</th>
          <td mat-cell *matCellDef="let i" class="text-center">{{ i.relevancia }}</td>
        </ng-container>

        <ng-container matColumnDef="criticidade">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Cri.</th>
          <td mat-cell *matCellDef="let i" class="text-center">{{ i.criticidade }}</td>
        </ng-container>

        <ng-container matColumnDef="risco">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Risco</th>
          <td mat-cell *matCellDef="let i" class="text-center">{{ i.risco }}</td>
        </ng-container>
      </ng-template>
    </app-data-table>
  `,
})
export class MatrizPriorizacaoComponent implements OnInit {
  itens: ItemUniverso[] = [];
  destaques: Set<string> = new Set();
  horasDisponiveis = '';
  error = '';
  loading = true;
  columns = ['indicePriorizacao', 'nome', 'tipo', 'unidadeResponsavel',
             'materialidade', 'relevancia', 'criticidade', 'risco'];

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    this.error = '';
    this.loading = true;
    try {
      const params: any = {};
      if (this.horasDisponiveis) {
        params.horas_disponiveis = this.horasDisponiveis;
      }
      const response = await firstValueFrom(
        this.http.get<{ itens: ItemUniverso[]; destaques: string[] }>(
          `${environment.apiUrl}/universo-auditavel/matriz-priorizacao`,
          { params },
        ),
      );
      this.itens = response.itens;
      this.destaques = new Set(response.destaques);
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar matriz de priorização';
    } finally {
      this.loading = false;
    }
  }


}
