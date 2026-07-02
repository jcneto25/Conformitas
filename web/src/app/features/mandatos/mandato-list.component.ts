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
import { ValidationService } from '../../shared/services/validation.service';

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

    <!-- Card Informativo -->
    <mat-card class="mb-6">
      <mat-card-content class="!p-4 bg-slate-50/30">
        <p class="m-0 text-text-sec text-sm">
          Mandatos de Auditor-Chefe (P01). Máximo 2 mandatos de 2 anos cada, com interstício mínimo de 1 ano.
        </p>
      </mat-card-content>
    </mat-card>

    @if (carregando) {
      <app-skeleton type="card" />
    } @else {
      <mat-card class="mb-6">
        <mat-card-content class="!p-6">
          <h3 class="text-lg font-semibold text-text-main mt-0">Novo Mandato</h3>
          <form (ngSubmit)="criar()" class="filter-bar gap-4 items-end">
            <mat-form-field appearance="outline" subscriptSizing="dynamic" class="min-w-[300px]">
              <mat-label>Auditor-Chefe</mat-label>
              <mat-select #usuarioModel="ngModel" [(ngModel)]="form.usuarioId" name="usuarioId" required>
                @for (u of usuarios; track u.id) {
                  <mat-option [value]="u.id">{{ u.nome }} ({{ u.email }})</mat-option>
                }
              </mat-select>
              @if (usuarioModel.invalid && usuarioModel.touched) {
                <mat-error>{{ validation.required('Auditor-chefe') }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" subscriptSizing="dynamic" class="min-w-[250px]">
              <mat-label>Ato de Designação</mat-label>
              <input matInput #atoModel="ngModel" [(ngModel)]="form.atoDesignacao" name="ato" required
                     placeholder="Ex: Portaria 123/2024" />
              @if (atoModel.invalid && atoModel.touched) {
                <mat-error>{{ validation.required('Ato de designação') }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" subscriptSizing="dynamic" class="min-w-[200px]">
              <mat-label>Data Início</mat-label>
              <input matInput #dataModel="ngModel" [matDatepicker]="pickerInicio" [(ngModel)]="form.dataInicio" name="dataInicio" required />
              <mat-datepicker-toggle matSuffix [for]="pickerInicio" />
              <mat-datepicker #pickerInicio />
              @if (dataModel.invalid && dataModel.touched) {
                <mat-error>{{ validation.required('Data de início') }}</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit"
                    [disabled]="!form.usuarioId || !form.atoDesignacao || !form.dataInicio || salvando"
                    class="h-[48px] flex items-center gap-2 px-5">
              @if (salvando) {
                <mat-spinner diameter="18" class="inline-block mr-1" />
              }
              Criar Mandato
            </button>
          </form>
          @if (createError) {
            <p class="text-red-600 text-sm mt-2">{{ createError }}</p>
          }
          @if (createSuccess) {
            <p class="text-green-700 text-sm mt-2">{{ createSuccess }}</p>
          }
        </mat-card-content>
      </mat-card>

      <app-data-table [data]="mandatos" [displayedColumns]="columns" [error]="error" emptyMessage="Nenhum mandato registrado." (retry)="loadMandatos()">
          <ng-container matColumnDef="numeroMandato">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="numeroMandato" class="font-semibold text-text-main w-[120px]">Mandato Nº</th>
            <td mat-cell *matCellDef="let m" class="py-3 font-medium text-text-main">{{ m.numeroMandato }}º</td>
          </ng-container>

          <ng-container matColumnDef="usuario">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="usuario" class="font-semibold text-text-main">Auditor-Chefe</th>
            <td mat-cell *matCellDef="let m" class="py-3 pr-4 text-text-sec">{{ m.usuario?.nome }}</td>
          </ng-container>

          <ng-container matColumnDef="dataInicio">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="dataInicio" class="font-semibold text-text-main w-[120px]">Início</th>
            <td mat-cell *matCellDef="let m" class="py-3 text-text-sec">{{ m.dataInicio | date }}</td>
          </ng-container>

          <ng-container matColumnDef="dataFimPrevista">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="dataFimPrevista" class="font-semibold text-text-main w-[120px]">Fim Previsto</th>
            <td mat-cell *matCellDef="let m" class="py-3 text-text-sec">{{ m.dataFimPrevista | date }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="status" class="font-semibold text-text-main w-[120px]">Status</th>
            <td mat-cell *matCellDef="let m" class="py-3">
              <span [class.text-green-700]="m.status === 'ATIVO'" [class.text-text-sec]="m.status !== 'ATIVO'">
                {{ m.status }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef class="font-semibold text-text-main w-[120px]">Ações</th>
            <td mat-cell *matCellDef="let m" class="py-3">
              <button mat-stroked-button color="warn" (click)="concluir(m.id)"
                      [disabled]="m.status !== 'ATIVO'">
                Concluir
              </button>
            </td>
          </ng-container>
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
    public readonly validation: ValidationService,
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
