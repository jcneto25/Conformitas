import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-classificacao-selector',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatChipsModule,
  ],
  template: `
    <div style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
      <!-- Classificação atual -->
      <div *ngIf="classificacaoAtual; else semClassificacao">
        <mat-chip [style.background]="nivelColor(classificacaoAtual.nivelSigilo)" style="color: #fff;">
          {{ classificacaoAtual.nivelSigilo }}
        </mat-chip>
      </div>
      <ng-template #semClassificacao>
        <span style="color: #999; font-size: 0.85rem;">Não classificado</span>
      </ng-template>

      <!-- Formulário de classificação -->
      <mat-form-field appearance="outline" style="min-width: 180px;">
        <mat-label>Nível de Sigilo</mat-label>
        <mat-select [(ngModel)]="nivelSelecionado" name="nivelSigilo" required>
          <mat-option value="PUBLICO">Público</mat-option>
          <mat-option value="INTERNO">Interno</mat-option>
          <mat-option value="RESTRITO">Restrito</mat-option>
          <mat-option value="SIGILOSO">Sigiloso</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" style="min-width: 250px;">
        <mat-label>Justificativa (opcional)</mat-label>
        <input matInput [(ngModel)]="justificativa" name="justificativa" />
      </mat-form-field>

      <button mat-stroked-button color="primary" (click)="classificar()"
              [disabled]="!nivelSelecionado || classificando">
        {{ classificando ? 'Classificando...' : 'Classificar' }}
      </button>

      <button mat-button *ngIf="classificacaoAtual" (click)="carregar()" style="margin-left: 0.5rem;">
        Recarregar
      </button>
    </div>
    <p *ngIf="error" style="color: #c62828; margin-top: 0.25rem; font-size: 0.85rem;">{{ error }}</p>
  `,
})
export class ClassificacaoSelectorComponent {
  @Input() entidadeTipo = '';
  @Input() entidadeId = '';
  @Output() classificacaoChange = new EventEmitter<any>();

  classificacaoAtual: any = null;
  nivelSelecionado = '';
  justificativa = '';
  classificando = false;
  error = '';

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    if (!this.entidadeTipo || !this.entidadeId) return;
    try {
      this.classificacaoAtual = await firstValueFrom(
        this.http.get<any>(`${API}/etica/${this.entidadeTipo}/${this.entidadeId}/classificacao`),
      );
    } catch {
      this.classificacaoAtual = null;
    }
  }

  async classificar() {
    if (!this.nivelSelecionado) return;
    this.error = '';
    this.classificando = true;
    try {
      this.classificacaoAtual = await firstValueFrom(
        this.http.put(`${API}/etica/${this.entidadeTipo}/${this.entidadeId}/classificacao`, {
          nivelSigilo: this.nivelSelecionado,
          justificativa: this.justificativa || undefined,
        }),
      );
      this.classificacaoChange.emit(this.classificacaoAtual);
      this.nivelSelecionado = '';
      this.justificativa = '';
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao classificar documento';
    } finally {
      this.classificando = false;
    }
  }

  nivelColor(nivel: string): string {
    const m: Record<string, string> = {
      PUBLICO: '#2e7d32',
      INTERNO: '#1565c0',
      RESTRITO: '#e65100',
      SIGILOSO: '#c62828',
    };
    return m[nivel] || '#888';
  }
}
