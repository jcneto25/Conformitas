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

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-papel-trabalho-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatListModule,
    MatIconModule, MatDividerModule,
  ],
  template: `
    <mat-card>
      <mat-card-content>
        <h3>Papéis de Trabalho</h3>

        <!-- Lista -->
        <mat-list *ngIf="papeis.length; else semPapeis">
          @for (p of papeis; track p.id) {
            <mat-list-item>
              <span matListItemTitle>
                <strong>{{ p.codigo }}</strong> — {{ p.descricao }}
              </span>
              <span matListItemLine *ngIf="p.evidencias?.length">
                Evidências: {{ p.evidencias.length }}
              </span>
              <span matListItemLine *ngIf="p.responsavel">
                Responsável: {{ p.responsavel?.nome || p.responsavelId }}
              </span>
            </mat-list-item>
            <mat-divider />
          }
        </mat-list>
        <ng-template #semPapeis>
          <p style="color: #999; padding: 1rem;">Nenhum papel de trabalho criado.</p>
        </ng-template>

        <!-- Form criação -->
        <h4>Criar Papel de Trabalho</h4>
        <form (ngSubmit)="criar()" style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
          <mat-form-field appearance="outline" style="min-width: 150px;">
            <mat-label>Código</mat-label>
            <input matInput [(ngModel)]="form.codigo" name="codigo" required
                   placeholder="PT-001" />
          </mat-form-field>

          <mat-form-field appearance="outline" style="min-width: 300px; flex: 1;">
            <mat-label>Descrição</mat-label>
            <input matInput [(ngModel)]="form.descricao" name="descricao" required />
          </mat-form-field>

          <mat-form-field appearance="outline" style="min-width: 250px;">
            <mat-label>Evidências Vinculadas</mat-label>
            <mat-select [(ngModel)]="form.evidenciaIds" name="evidenciaIds" multiple>
              <mat-option *ngFor="let e of evidenciasDisponiveis" [value]="e.id">
                {{ e.tipo }} — {{ e.descricao }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit"
                  [disabled]="!form.codigo || !form.descricao">
            Criar
          </button>
        </form>

        <p *ngIf="error" style="color: #c62828; margin-top: 0.5rem;">{{ error }}</p>
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

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await this.loadEvidencias();
  }

  async loadEvidencias() {
    try {
      this.evidenciasDisponiveis = await firstValueFrom(
        this.http.get<any[]>(`${API}/auditorias/${this.auditoriaId}/evidencias`),
      );
    } catch {
      // non-blocking
    }
  }

  async criar() {
    if (!this.form.codigo || !this.form.descricao) return;
    this.error = '';
    try {
      const novo = await firstValueFrom(
        this.http.post(`${API}/auditorias/${this.auditoriaId}/papeis-trabalho`, {
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
    }
  }
}
