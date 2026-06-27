import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-perfil-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatCardModule],
  template: `
    <h1>Perfis (RBAC)</h1>

    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content>
        <p style="margin: 0; color: #666;">
          Perfis de acesso do sistema (P01 a P10). Use o formulário de usuário para atribuir/remover perfis.
        </p>
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-content>
        <table mat-table [dataSource]="perfis" class="mat-elevation-z0" style="width: 100%;">

          <ng-container matColumnDef="codigo">
            <th mat-header-cell *matHeaderCellDef>Código</th>
            <td mat-cell *matCellDef="let p">
              <strong>{{ p.codigo }}</strong>
            </td>
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

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>

        <p *ngIf="!perfis.length && !error" style="text-align: center; color: #999; padding: 2rem;">
          Nenhum perfil encontrado.
        </p>

        <p *ngIf="error" style="color: #c62828; text-align: center;">{{ error }}</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class PerfilListComponent implements OnInit {
  perfis: any[] = [];
  error = '';
  columns = ['codigo', 'nome', 'descricao', 'nivelAcesso'];

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    try {
      this.perfis = await firstValueFrom(
        this.http.get<any[]>(`${API}/perfis`),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar perfis';
    }
  }
}
