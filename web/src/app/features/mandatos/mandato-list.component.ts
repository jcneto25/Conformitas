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
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-mandato-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
  ],
  template: `
    <h1>Mandatos do Auditor-Chefe</h1>

    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content>
        <p style="margin: 0; color: #666;">
          Mandatos de Auditor-Chefe (P01). Máximo 2 mandatos de 2 anos cada, com interstício mínimo de 1 ano.
        </p>
      </mat-card-content>
    </mat-card>

    <!-- Formulário de criação -->
    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content>
        <h3>Novo Mandato</h3>
        <form (ngSubmit)="criar()" style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
          <mat-form-field appearance="outline" style="min-width: 300px;">
            <mat-label>Auditor-Chefe</mat-label>
            <mat-select [(ngModel)]="form.usuarioId" name="usuarioId" required>
              @for (u of usuarios; track u.id) {
                <mat-option [value]="u.id">{{ u.nome }} ({{ u.email }})</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" style="min-width: 250px;">
            <mat-label>Ato de Designação</mat-label>
            <input matInput [(ngModel)]="form.atoDesignacao" name="ato" required
                   placeholder="Ex: Portaria 123/2024" />
          </mat-form-field>

          <mat-form-field appearance="outline" style="min-width: 200px;">
            <mat-label>Data Início</mat-label>
            <input matInput [matDatepicker]="pickerInicio" [(ngModel)]="form.dataInicio" name="dataInicio" required />
            <mat-datepicker-toggle matSuffix [for]="pickerInicio" />
            <mat-datepicker #pickerInicio />
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit"
                  [disabled]="!form.usuarioId || !form.atoDesignacao || !form.dataInicio">
            Criar Mandato
          </button>
        </form>
        <p *ngIf="createError" style="color: #c62828; margin-top: 0.5rem;">{{ createError }}</p>
        <p *ngIf="createSuccess" style="color: #2e7d32; margin-top: 0.5rem;">{{ createSuccess }}</p>
      </mat-card-content>
    </mat-card>

    <!-- Lista de mandatos -->
    <mat-card>
      <mat-card-content>
        <table mat-table [dataSource]="mandatos" class="mat-elevation-z0" style="width: 100%;">

          <ng-container matColumnDef="numeroMandato">
            <th mat-header-cell *matHeaderCellDef>Mandato Nº</th>
            <td mat-cell *matCellDef="let m">{{ m.numeroMandato }}º</td>
          </ng-container>

          <ng-container matColumnDef="usuario">
            <th mat-header-cell *matHeaderCellDef>Auditor-Chefe</th>
            <td mat-cell *matCellDef="let m">{{ m.usuario?.nome }}</td>
          </ng-container>

          <ng-container matColumnDef="dataInicio">
            <th mat-header-cell *matHeaderCellDef>Início</th>
            <td mat-cell *matCellDef="let m">{{ m.dataInicio | date }}</td>
          </ng-container>

          <ng-container matColumnDef="dataFimPrevista">
            <th mat-header-cell *matHeaderCellDef>Fim Previsto</th>
            <td mat-cell *matCellDef="let m">{{ m.dataFimPrevista | date }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let m">
              <span [style.color]="m.status === 'ATIVO' ? '#2e7d32' : '#888'">
                {{ m.status }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let m">
              <button mat-stroked-button color="warn" (click)="concluir(m.id)"
                      [disabled]="m.status !== 'ATIVO'">
                Concluir
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>

        <p *ngIf="!mandatos.length && !error" style="text-align: center; color: #999; padding: 2rem;">
          Nenhum mandato registrado.
        </p>

        <p *ngIf="error" style="color: #c62828; text-align: center;">{{ error }}</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class MandatoListComponent implements OnInit {
  mandatos: any[] = [];
  usuarios: any[] = [];
  error = '';
  createError = '';
  createSuccess = '';
  columns = ['numeroMandato', 'usuario', 'dataInicio', 'dataFimPrevista', 'status', 'acoes'];
  form = { usuarioId: '', atoDesignacao: '', dataInicio: '' as string | Date };

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await Promise.all([this.loadMandatos(), this.loadUsuarios()]);
  }

  async loadMandatos() {
    try {
      this.mandatos = await firstValueFrom(
        this.http.get<any[]>(`${API}/mandatos`),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar mandatos';
    }
  }

  async loadUsuarios() {
    try {
      this.usuarios = await firstValueFrom(
        this.http.get<any[]>(`${API}/usuarios`),
      );
    } catch {
      // non-blocking — usuários podem não estar disponíveis
    }
  }

  async criar() {
    this.createError = '';
    this.createSuccess = '';
    try {
      await firstValueFrom(
        this.http.post(`${API}/mandatos`, {
          usuarioId: this.form.usuarioId,
          atoDesignacao: this.form.atoDesignacao,
          dataInicio: this.form.dataInicio,
        }),
      );
      this.createSuccess = 'Mandato criado com sucesso';
      this.form = { usuarioId: '', atoDesignacao: '', dataInicio: '' };
      await this.loadMandatos();
    } catch (err: any) {
      this.createError = err?.error?.message || 'Erro ao criar mandato';
    }
  }

  async concluir(id: string) {
    try {
      await firstValueFrom(
        this.http.patch(`${API}/mandatos/${id}/concluir`, {}),
      );
      await this.loadMandatos();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao concluir mandato';
    }
  }
}
