import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

const API = 'http://localhost:3001/api/v1';
// Placeholder até o contexto de auth (PRP-001) estar disponível no frontend.
const AUTOR_ID = 'p01-auditor-chefe';

@Component({
  selector: 'app-relatorio-preview',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatChipsModule, MatIconModule, MatDividerModule,
  ],
  template: `
    <h1>Relatórios de Auditoria</h1>

    <!-- Filtro por auditoria -->
    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content>
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <mat-form-field appearance="outline" style="flex: 1; min-width: 240px;">
            <mat-label>ID da Auditoria</mat-label>
            <input matInput [(ngModel)]="auditoriaId" name="auditoriaId" placeholder="uuid da auditoria" />
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="carregar()" [disabled]="!auditoriaId">
            <mat-icon>search</mat-icon> Carregar
          </button>
        </div>
      </mat-card-content>
    </mat-card>

    <!-- Gerar relatório -->
    <mat-card style="margin-bottom: 1rem;">
      <mat-card-header><mat-card-title>Gerar Relatório</mat-card-title></mat-card-header>
      <mat-card-content>
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <mat-form-field appearance="outline" style="width: 220px;">
            <mat-label>Tipo</mat-label>
            <mat-select [(ngModel)]="gerarTipo" name="tipo">
              <mat-option value="PRELIMINAR">Preliminar</mat-option>
              <mat-option value="FINAL">Final</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="accent" (click)="gerar()" [disabled]="!auditoriaId">
            <mat-icon>picture_as_pdf</mat-icon> Gerar
          </button>
          <span style="color: #888; font-size: 0.85rem;">
            Preliminar compila achados PRELIMINAR; Final exige todos CONSOLIDADO.
          </span>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-divider />

    <!-- Lista de relatórios -->
    <h2 *ngIf="relatorios.length > 0">Relatórios ({{ relatorios.length }})</h2>
    <p *ngIf="relatorios.length === 0 && auditoriaId" style="color: #888;">Nenhum relatório para esta auditoria.</p>

    @for (r of relatorios; track r.id) {
      <mat-card style="margin-top: 1rem;">
        <mat-card-content>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div>
              <mat-chip-set>
                <mat-chip>{{ r.tipo }}</mat-chip>
                <mat-chip [highlighted]="r.status === 'ASSINADO'" color="primary">{{ r.status }}</mat-chip>
              </mat-chip-set>
              <p *ngIf="r.dataEmissao" style="color: #666; margin: 0.5rem 0 0;">
                Emitido em {{ r.dataEmissao | date:'short' }}
              </p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button mat-stroked-button (click)="baixarPdf(r.id)">
                <mat-icon>download</mat-icon> PDF
              </button>
              <button *ngIf="r.status === 'RASCUNHO'" mat-raised-button color="primary" (click)="assinar(r.id)">
                <mat-icon>draw</mat-icon> Assinar (P01)
              </button>
            </div>
          </div>
          <pre style="white-space: pre-wrap; background: #f7f7f7; padding: 0.75rem; margin-top: 0.75rem; border-radius: 4px;">{{ preview(r.conteudo) }}</pre>
        </mat-card-content>
      </mat-card>
    }
  `,
})
export class RelatorioPreviewComponent implements OnInit {
  auditoriaId = '';
  relatorios: any[] = [];
  gerarTipo: 'PRELIMINAR' | 'FINAL' = 'PRELIMINAR';

  constructor(private readonly http: HttpClient) {}

  ngOnInit() {}

  async carregar() {
    if (!this.auditoriaId) return;
    this.relatorios = await firstValueFrom(
      this.http.get<any[]>(`${API}/relatorios`, { params: { auditoriaId: this.auditoriaId } }),
    );
  }

  async gerar() {
    if (!this.auditoriaId) return;
    await firstValueFrom(
      this.http.post(`${API}/auditorias/${this.auditoriaId}/relatorios`, {
        tipo: this.gerarTipo,
        autorId: AUTOR_ID,
      }),
    );
    await this.carregar();
  }

  async assinar(id: string) {
    await firstValueFrom(
      this.http.post(`${API}/relatorios/${id}/assinar`, { userId: AUTOR_ID }),
    );
    await this.carregar();
  }

  baixarPdf(id: string) {
    window.open(`${API}/relatorios/${id}/pdf`, '_blank');
  }

  preview(conteudo: string): string {
    return (conteudo || '').slice(0, 300);
  }
}
