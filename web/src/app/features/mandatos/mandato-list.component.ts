import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';
import { DataTableComponent } from '../../shared/components/data-table.component';

@Component({
  selector: 'app-mandato-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule,
    MatTableModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, PageHeaderComponent, SkeletonComponent,
    DataTableComponent,
  ],
  template: `
    <app-page-header title="Mandatos do Auditor-Chefe" />

    <mat-card class="mb-4">
      <mat-card-content>
        <p class="m-0 text-text-sec text-sm">
          Mandatos de Auditor-Chefe (P01). Máximo 2 mandatos de 2 anos cada, com interstício mínimo de 1 ano.
        </p>
      </mat-card-content>
    </mat-card>

    @if (carregando) {
      <app-skeleton type="card" />
    } @else {
      <mat-card class="mb-4">
        <mat-card-content>
          <h3 class="text-lg font-semibold text-text-main mt-0">Novo Mandato</h3>
          <form (ngSubmit)="criar()" class="flex gap-4 items-end flex-wrap">
            <mat-form-field appearance="outline" class="min-w-[300px]">
              <mat-label>Auditor-Chefe</mat-label>
              <mat-select [(ngModel)]="form.usuarioId" name="usuarioId" required>
                @for (u of usuarios; track u.id) {
                  <mat-option [value]="u.id">{{ u.nome }} ({{ u.email }})</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="min-w-[250px]">
              <mat-label>Ato de Designação</mat-label>
              <input matInput [(ngModel)]="form.atoDesignacao" name="ato" required
                     placeholder="Ex: Portaria 123/2024" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="min-w-[200px]">
              <mat-label>Data Início</mat-label>
              <input matInput [matDatepicker]="pickerInicio" [(ngModel)]="form.dataInicio" name="dataInicio" required />
              <mat-datepicker-toggle matSuffix [for]="pickerInicio" />
              <mat-datepicker #pickerInicio />
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit"
                    [disabled]="!form.usuarioId || !form.atoDesignacao || !form.dataInicio || salvando">
              @if (salvando) {
                <mat-spinner diameter="18" class="inline-block mr-1" />
              }
              Criar Mandato
            </button>
          </form>
          @if (createError) {
            <p class="text-critical text-sm mt-2">{{ createError }}</p>
          }
          @if (createSuccess) {
            <p class="text-success text-sm mt-2">{{ createSuccess }}</p>
          }
        </mat-card-content>
      </mat-card>

      <app-data-table [data]="mandatos" [displayedColumns]="columns" [error]="error" emptyMessage="Nenhum mandato registrado.">
        <ng-template #tableBody>
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
              <span [class.text-success]="m.status === 'ATIVO'" [class.text-text-sec]="m.status !== 'ATIVO'">
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
        </ng-template>
      </app-data-table>
    }
  `,
})
export class MandatoListComponent implements OnInit {
  mandatos: any[] = [];
  usuarios: any[] = [];
  carregando = true;
  salvando = false;
  error = '';
  createError = '';
  createSuccess = '';
  columns = ['numeroMandato', 'usuario', 'dataInicio', 'dataFimPrevista', 'status', 'acoes'];
  form = { usuarioId: '', atoDesignacao: '', dataInicio: '' as string | Date };

  constructor(
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
  ) {}

  async ngOnInit() {
    await Promise.all([this.loadMandatos(), this.loadUsuarios()]);
    this.carregando = false;
  }

  async loadMandatos() {
    try {
      this.mandatos = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/mandatos`),
      );
    } catch {
      this.error = 'Erro ao carregar mandatos';
    }
  }

  async loadUsuarios() {
    try {
      this.usuarios = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/usuarios`),
      );
    } catch {
      // non-blocking — usuários podem não estar disponíveis
    }
  }

  async criar() {
    if (this.salvando) return;
    this.salvando = true;
    this.createError = '';
    this.createSuccess = '';
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/mandatos`, {
          usuarioId: this.form.usuarioId,
          atoDesignacao: this.form.atoDesignacao,
          dataInicio: this.form.dataInicio,
        }),
      );
      this.createSuccess = 'Mandato criado com sucesso';
      this.form = { usuarioId: '', atoDesignacao: '', dataInicio: '' };
      await this.loadMandatos();
    } catch {
      this.createError = 'Erro ao criar mandato';
    } finally {
      this.salvando = false;
    }
  }

  async concluir(id: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar', message: 'Concluir este mandato?', confirmText: 'Sim', cancelText: 'Não', type: 'warning' } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    try {
      await firstValueFrom(
        this.http.patch(`${environment.apiUrl}/mandatos/${id}/concluir`, {}),
      );
      await this.loadMandatos();
    } catch {
      this.error = 'Erro ao concluir mandato';
    }
  }
}
