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

@Component({
  selector: 'app-papel-trabalho-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatListModule,
    MatIconModule, MatDividerModule, MatProgressSpinnerModule,
  ],
  template: `
    <mat-card>
      <mat-card-content>
        <h3>Papéis de Trabalho</h3>

        @if (loading) {
          <div class="flex justify-center p-4">
            <mat-spinner diameter="30" />
          </div>
        } @else if (papeis.length) {
          <mat-list>
            @for (p of papeis; track p.id) {
              <mat-list-item>
                <span matListItemTitle>
                  <strong>{{ p.codigo }}</strong> — {{ p.descricao }}
                </span>
                @if (p.evidencias?.length) {
                  <span matListItemLine>Evidências: {{ p.evidencias.length }}</span>
                }
                @if (p.responsavel) {
                  <span matListItemLine>Responsável: {{ p.responsavel?.nome || p.responsavelId }}</span>
                }
              </mat-list-item>
              <mat-divider />
            }
          </mat-list>
        } @else {
          <p class="text-text-sec p-4">Nenhum papel de trabalho criado.</p>
        }

        <h4>Criar Papel de Trabalho</h4>
        <form (ngSubmit)="criar()" class="flex gap-4 items-end flex-wrap">
          <mat-form-field appearance="outline" class="min-w-[150px]">
            <mat-label>Código</mat-label>
            <input matInput #codigoModel="ngModel" [(ngModel)]="form.codigo" name="codigo" required
                   placeholder="PT-001" />
            @if (codigoModel.invalid && codigoModel.touched) {
              <mat-error>Código obrigatório</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="min-w-[300px] flex-1">
            <mat-label>Descrição</mat-label>
            <input matInput #descModel="ngModel" [(ngModel)]="form.descricao" name="descricao" required />
            @if (descModel.invalid && descModel.touched) {
              <mat-error>Descrição obrigatória</mat-error>
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
                  [disabled]="!form.codigo || !form.descricao || criando">
            @if (criando) {
              <mat-spinner diameter="16" class="inline-block mr-1" />
            }
            Criar
          </button>
        </form>

        @if (error) {
          <p class="text-critical mt-2">{{ error }}</p>
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

  constructor(private readonly http: HttpClient) {}

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
