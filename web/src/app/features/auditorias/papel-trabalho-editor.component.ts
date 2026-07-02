import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';
import { ValidationService } from '../../shared/services/validation.service';

@Component({
  selector: 'app-papel-trabalho-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatListModule,
    MatIconModule, MatDividerModule, MatProgressSpinnerModule, EmptyStateComponent,
  ],
  template: `
    <mat-card class="border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
      <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
        <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
          <mat-icon class="text-primary">description</mat-icon>
          Papéis de Trabalho
        </mat-card-title>
        <mat-card-subtitle class="text-xs text-text-sec">Documentação organizada que sustenta os achados da auditoria.</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="p-6">
        @if (loading) {
          <div class="flex justify-center py-6">
            <mat-spinner diameter="30" />
          </div>
        } @else if (papeis.length) {
          <mat-list>
            @for (p of papeis; track p.id) {
              <mat-list-item>
                <mat-icon aria-hidden="true" matListItemIcon class="text-primary">folder</mat-icon>
                <span matListItemTitle class="text-sm font-medium text-text-main">
                  {{ p.codigo }} — {{ p.descricao }}
                </span>
                @if (p.evidencias?.length) {
                  <span matListItemLine class="text-text-sec text-xs">Evidências: {{ p.evidencias.length }}</span>
                }
                @if (p.responsavel) {
                  <span matListItemLine class="text-text-sec text-xs">Responsável: {{ p.responsavel?.nome || p.responsavelId }}</span>
                }
              </mat-list-item>
              <mat-divider />
            }
          </mat-list>
        } @else {
          <app-empty-state icon="inbox" title="Nenhum papel de trabalho criado" description="Crie papéis de trabalho para documentar os procedimentos de auditoria executados." size="sm" />
        }

        <h4 class="text-sm font-semibold text-text-main mb-3 mt-6 flex items-center gap-2">
          <mat-icon class="text-[18px] text-primary">add</mat-icon>
          Criar Papel de Trabalho
        </h4>
        <form (ngSubmit)="criar()" class="filter-bar gap-4 items-end">
          <mat-form-field appearance="outline" class="min-w-[150px]">
            <mat-label>Código</mat-label>
            <input matInput #codigoModel="ngModel" [(ngModel)]="form.codigo" name="codigo" required
                   placeholder="PT-001" />
            @if (codigoModel.invalid && codigoModel.touched) {
              <mat-error>{{ validation.required('Código') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="min-w-[300px] flex-1">
            <mat-label>Descrição</mat-label>
            <input matInput #descModel="ngModel" [(ngModel)]="form.descricao" name="descricao" required />
            @if (descModel.invalid && descModel.touched) {
              <mat-error>{{ validation.required('Descrição') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="min-w-[250px]">
            <mat-label>Evidências Vinculadas</mat-label>
            <mat-select [(ngModel)]="form.evidenciaIds" name="evidenciaIds" multiple>
              @for (e of evidenciasDisponiveis; track e.id) {
                <mat-option [value]="e.id">
                  {{ e.tipo }} — {{ e.descricao }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit"
                  [disabled]="!form.codigo || !form.descricao || criando" class="flex items-center gap-2">
            @if (criando) {
              <mat-spinner diameter="16" class="inline-block mr-1" />
            }
            <mat-icon>add_circle</mat-icon>
            Criar
          </button>
        </form>

        @if (error) {
          <div class="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100 mt-3" role="alert">
            <mat-icon class="text-[18px]">error_outline</mat-icon>
            <span>{{ error }}</span>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class PapelTrabalhoEditorComponent implements OnInit {
  @Input() auditoriaId = '';
  @Input() papeis: any[] = [];
  @Output() papeisChange = new EventEmitter<any[]>();

  evidenciasDisponiveis: any[] = [];
  form = { codigo: '', descricao: '', evidenciaIds: [] as string[] };
  error = '';
  loading = true;
  criando = false;

  constructor(
    private readonly http: HttpClient,
    public readonly validation: ValidationService,
  ) {}

  async ngOnInit() {
    try {
      await this.loadEvidencias();
    } finally {
      this.loading = false;
    }
  }

  async loadEvidencias() {
    try {
      this.evidenciasDisponiveis = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/auditorias/${this.auditoriaId}/evidencias`),
      );
    } catch {
      // non-blocking
    }
  }

  async criar() {
    if (!this.form.codigo || !this.form.descricao) return;
    this.error = '';
    this.criando = true;
    try {
      const novo = await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auditorias/${this.auditoriaId}/papeis-trabalho`, {
          codigo: this.form.codigo,
          descricao: this.form.descricao,
          evidenciaIds: this.form.evidenciaIds.length ? this.form.evidenciaIds : undefined,
        }),
      );
      this.papeis = [...this.papeis, novo];
      this.papeisChange.emit(this.papeis);
      this.form = { codigo: '', descricao: '', evidenciaIds: [] };
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao criar papel de trabalho';
    } finally {
      this.criando = false;
    }
  }
}
