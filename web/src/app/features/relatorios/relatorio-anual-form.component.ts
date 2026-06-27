import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

const API = 'http://localhost:3001/api/v1';
// Placeholder até o contexto de auth (PRP-001) estar disponível no frontend.
const AUTOR_ID = 'p01-auditor-chefe';

@Component({
  selector: 'app-relatorio-anual-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatChipsModule, MatIconModule,
  ],
  template: `
    <h1>Relatório Anual de Atividades</h1>

    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content>
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <mat-form-field appearance="outline" style="width: 160px;">
            <mat-label>Ano (exercício)</mat-label>
            <input matInput type="number" [(ngModel)]="ano" name="ano" placeholder="2025" />
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="gerar()" [disabled]="!ano">
            <mat-icon>insights</mat-icon> Gerar Relatório Anual
          </button>
          <span style="color: #888; font-size: 0.85rem;">Consolida indicadores do exercício (P01).</span>
        </div>
        <p *ngIf="erro" style="color: #c62828; margin-top: 0.5rem;">{{ erro }}</p>
      </mat-card-content>
    </mat-card>

    <mat-card *ngIf="resultado">
      <mat-card-header>
        <mat-card-title>Relatório Anual {{ resultado.ano }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-chip-set>
          <mat-chip [highlighted]="true" color="primary">{{ resultado.status }}</mat-chip>
        </mat-chip-set>
        <pre style="white-space: pre-wrap; background: #f7f7f7; padding: 0.75rem; margin-top: 0.75rem; border-radius: 4px;">{{ resultado.conteudo }}</pre>
      </mat-card-content>
    </mat-card>
  `,
})
export class RelatorioAnualFormComponent {
  ano: number | null = new Date().getFullYear();
  resultado: any = null;
  erro = '';

  constructor(private readonly http: HttpClient) {}

  async gerar() {
    this.erro = '';
    this.resultado = null;
    if (!this.ano) return;
    try {
      this.resultado = await firstValueFrom(
        this.http.post<any>(`${API}/relatorios-anuais`, {
          ano: this.ano,
          autorId: AUTOR_ID,
        }),
      );
    } catch (e: any) {
      this.erro = e?.error?.message || 'Erro ao gerar relatório anual (já existe para o ano?)';
    }
  }
}
