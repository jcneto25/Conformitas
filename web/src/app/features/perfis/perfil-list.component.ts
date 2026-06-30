import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { DataTableComponent } from '../../shared/components/data-table.component';

@Component({
  selector: 'app-perfil-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, PageHeaderComponent, DataTableComponent],
  template: `
    <app-page-header title="Perfis (RBAC)" />

    <mat-card class="mb-4">
      <mat-card-content>
        <p class="m-0 text-text-sec">
          Perfis de acesso do sistema (P01 a P10). Use o formulário de usuário para atribuir/remover perfis.
        </p>
      </mat-card-content>
    </mat-card>

    <app-data-table
      [data]="perfis"
      [displayedColumns]="columns"
      [loading]="loading"
      [error]="error"
      (retry)="ngOnInit()"
      emptyMessage="Nenhum perfil encontrado.">
      <ng-template #tableBody>
        <ng-container matColumnDef="codigo">
          <th mat-header-cell *matHeaderCellDef>Código</th>
          <td mat-cell *matCellDef="let p"><strong>{{ p.codigo }}</strong></td>
        </ng-container>

        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef>Nome</th>
          <td mat-cell *matCellDef="let p">{{ p.nome }}</td>
        </ng-container>

        <ng-container matColumnDef="descricao">
          <th mat-header-cell *matHeaderCellDef>Descrição</th>
          <td mat-cell *matCellDef="let p">{{ p.descricao }}</td>
        </ng-container>

        <ng-container matColumnDef="nivelAcesso">
          <th mat-header-cell *matHeaderCellDef>Nível Acesso</th>
          <td mat-cell *matCellDef="let p">{{ p.nivelAcesso }}</td>
        </ng-container>
      </ng-template>
    </app-data-table>
  `,
})
export class PerfilListComponent implements OnInit {
  perfis: any[] = [];
  error = '';
  loading = true;
  columns = ['codigo', 'nome', 'descricao', 'nivelAcesso'];

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    try {
      this.loading = true;
      this.perfis = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/perfis`),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar perfis';
    } finally {
      this.loading = false;
    }
  }
}
