import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

const API = environment.apiUrl;

@Component({
  selector: 'app-quadro-achados',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatTableModule, MatChipsModule,
    MatButtonModule, MatIconModule, MatSelectModule,
    MatFormFieldModule, MatProgressSpinnerModule, PageHeaderComponent,
  ],
  template: `
    <app-page-header title="Quadro de Achados" [breadcrumbs]="[{label: 'Auditoria', route: '/auditorias'}, {label: 'Achados'}]">
      <div actions>
        <button mat-raised-button color="primary" routerLink="/achados/novo">
          <mat-icon>add</mat-icon> Novo Achado
        </button>
      </div>
    </app-page-header>

    <div class="flex items-center gap-4 mb-4">
      <mat-form-field appearance="outline" class="w-48">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="filtroStatus" (selectionChange)="load()">
          <mat-option value="">Todos</mat-option>
          <mat-option value="PRELIMINAR">Preliminar</mat-option>
          <mat-option value="EM_MANIFESTACAO">Em Manifestação</mat-option>
          <mat-option value="CONSOLIDADO">Consolidado</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    @if (loading) {
      <div class="flex justify-center py-8">
        <mat-spinner diameter="40" />
      </div>
    } @else if (error) {
      <mat-card class="border border-red-50">
        <mat-card-content class="flex items-center gap-2 text-critical">
          <mat-icon>error_outline</mat-icon>
          <span>{{ error }}</span>
          <button mat-button color="primary" (click)="load()" class="ml-auto">Tentar novamente</button>
        </mat-card-content>
      </mat-card>
    } @else if (achados.length === 0) {
      <mat-card>
        <mat-card-content class="text-center py-8 text-text-sec">
          <mat-icon class="text-4xl mb-2">search_off</mat-icon>
          <p class="m-0">Nenhum achado encontrado</p>
        </mat-card-content>
      </mat-card>
    } @else {
      <mat-card>
        <mat-card-content class="p-0">
          <table mat-table [dataSource]="achados" class="w-full">
            <ng-container matColumnDef="codigo">
              <th mat-header-cell *matHeaderCellDef class="text-text-sec text-sm font-medium">Código</th>
              <td mat-cell *matCellDef="let a" class="text-sm">{{ a.codigo }}</td>
            </ng-container>
            <ng-container matColumnDef="tipo">
              <th mat-header-cell *matHeaderCellDef class="text-text-sec text-sm font-medium">Tipo</th>
              <td mat-cell *matCellDef="let a" class="text-sm">{{ a.tipo }}</td>
            </ng-container>
            <ng-container matColumnDef="situacao">
              <th mat-header-cell *matHeaderCellDef class="text-text-sec text-sm font-medium">Situação</th>
              <td mat-cell *matCellDef="let a" class="text-sm max-w-xs truncate">{{ a.situacaoEncontrada }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="text-text-sec text-sm font-medium">Status</th>
              <td mat-cell *matCellDef="let a">
                <mat-chip [color]="statusChipColor(a.status)" highlighted="false" class="text-xs">
                  {{ a.status }}
                </mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="acoes">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let a">
                <button mat-icon-button [routerLink]="['/achados', a.id]" matTooltip="Visualizar" aria-label="Visualizar achado">
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="cols" class="bg-gray-50"></tr>
            <tr mat-row *matRowDef="let r; columns: cols" class="hover:bg-gray-50 transition-colors"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    }
  `,
})
export class QuadroAchadosComponent implements OnInit {
  cols = ['codigo', 'tipo', 'situacao', 'status', 'acoes'];
  achados: any[] = [];
  filtroStatus = '';
  loading = false;
  error = '';

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    this.error = '';
    try {
      const params: any = {};
      if (this.filtroStatus) params.status = this.filtroStatus;
      this.achados = await firstValueFrom(
        this.http.get<any[]>(`${API}/achados`, { params }),
      );
    } catch {
      this.error = 'Erro ao carregar achados';
    } finally {
      this.loading = false;
    }
  }

  statusChipColor(s: string) {
    return s === 'PRELIMINAR' ? 'warn' : s === 'EM_MANIFESTACAO' ? 'primary' : 'accent';
  }
}
