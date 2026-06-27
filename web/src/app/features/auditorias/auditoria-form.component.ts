import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-auditoria-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatSlideToggleModule,
    MatDividerModule, MatChipsModule,
  ],
  template: `
    <h1>{{ isNew ? 'Abrir Auditoria' : 'Auditoria ' + auditoria?.codigo }}</h1>

    <!-- Formulário de abertura -->
    <mat-card *ngIf="isNew || editing" style="margin-bottom: 1rem;">
      <mat-card-content>
        <h3>{{ isNew ? 'Nova Auditoria' : 'Editar' }}</h3>
        <form (ngSubmit)="salvar()" style="display: flex; flex-direction: column; gap: 1rem;">
          <mat-form-field appearance="outline">
            <mat-label>Item do PAA</mat-label>
            <mat-select [(ngModel)]="form.itemPlanoId" name="itemPlanoId" required>
              <mat-option *ngFor="let i of itensPlano" [value]="i.id">
                {{ i.nome || i.id }} — {{ i.plano?.tipo || 'PAA' }}
              </mat-option>
            </mat-select>
            <mat-hint *ngIf="!itensPlano.length">Carregando itens do plano...</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Observações</mat-label>
            <textarea matInput [(ngModel)]="form.observacoes" name="observacoes" rows="3"></textarea>
          </mat-form-field>

          <mat-slide-toggle [(ngModel)]="form.sigilosa" name="sigilosa" color="warn">
            Auditoria Sigilosa
          </mat-slide-toggle>

          <div>
            <button mat-raised-button color="primary" type="submit"
                    [disabled]="!form.itemPlanoId">
              {{ isNew ? 'Abrir Auditoria' : 'Salvar' }}
            </button>
            <button mat-button type="button" (click)="router.navigate(['/auditorias'])" style="margin-left: 0.5rem;">
              Cancelar
            </button>
          </div>
        </form>

        <p *ngIf="error" style="color: #c62828; margin-top: 0.5rem;">{{ error }}</p>
        <p *ngIf="success" style="color: #2e7d32; margin-top: 0.5rem;">{{ success }}</p>
      </mat-card-content>
    </mat-card>

    <!-- Detalhes da auditoria -->
    <mat-card *ngIf="!isNew && auditoria" style="margin-bottom: 1rem;">
      <mat-card-content>
        <h3>Detalhes</h3>
        <p><strong>Status:</strong>
          <mat-chip [style.background]="statusColor()" style="color: #fff; margin-left: 0.5rem;">
            {{ auditoria.status }}
          </mat-chip>
        </p>
        <p *ngIf="auditoria.codigo"><strong>Código:</strong> {{ auditoria.codigo }}</p>
        <p *ngIf="auditoria.unidadeAuditada"><strong>Unidade Auditada:</strong> {{ auditoria.unidadeAuditada }}</p>
        <p *ngIf="auditoria.observacoes"><strong>Observações:</strong> {{ auditoria.observacoes }}</p>
        <p *ngIf="auditoria.motivoSuspensao"><strong>Motivo Suspensão:</strong> {{ auditoria.motivoSuspensao }}</p>
        <p *ngIf="auditoria.createdAt"><strong>Criada em:</strong> {{ auditoria.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
      </mat-card-content>
    </mat-card>

    <!-- Comunicado Preview -->
    <mat-card *ngIf="!isNew && auditoria">
      <mat-card-content>
        <h3>Comunicado de Auditoria</h3>
        <div *ngIf="comunicado; else semComunicado" style="background: #f5f5f5; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
          <p><strong>Número:</strong> {{ comunicado.numero }}</p>
          <p><strong>Data:</strong> {{ comunicado.dataEmissao | date:'dd/MM/yyyy' }}</p>
          <p><strong>Destinatário:</strong> {{ comunicado.destinatario }}</p>
          <p><strong>Conteúdo:</strong></p>
          <pre style="white-space: pre-wrap; font-family: inherit;">{{ comunicado.conteudo }}</pre>
        </div>
        <ng-template #semComunicado>
          <p style="color: #999;">Nenhum comunicado gerado ainda.</p>
        </ng-template>
        <button mat-stroked-button color="primary" (click)="gerarComunicado()"
                [disabled]="gerando">
          {{ gerando ? 'Gerando...' : 'Gerar Comunicado' }}
        </button>
      </mat-card-content>
    </mat-card>
  `,
})
export class AuditoriaFormComponent implements OnInit {
  isNew = true;
  auditoria: any = null;
  comunicado: any = null;
  itensPlano: any[] = [];
  editing = false;
  gerando = false;
  error = '';
  success = '';
  form = { itemPlanoId: '', observacoes: '', sigilosa: false };
  private id = '';

  constructor(
    readonly route: ActivatedRoute,
    readonly router: Router,
    private readonly http: HttpClient,
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.isNew = !this.id;
    this.editing = this.isNew;

    await Promise.all([this.loadItensPlano()]);

    if (!this.isNew) {
      await this.loadAuditoria();
    }
  }

  async loadItensPlano() {
    try {
      const planos = await firstValueFrom(
        this.http.get<any[]>(`${API}/planos`, { params: { status: 'APROVADO' } }),
      );
      for (const plano of planos) {
        const itens = await firstValueFrom(
          this.http.get<any[]>(`${API}/planos/${plano.id}/itens`),
        );
        this.itensPlano.push(...itens.map((i: any) => ({ ...i, plano })));
      }
    } catch {
      // non-blocking
    }
  }

  async loadAuditoria() {
    try {
      this.auditoria = await firstValueFrom(
        this.http.get<any>(`${API}/auditorias/${this.id}`),
      );
      await this.loadComunicado();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar auditoria';
    }
  }

  async loadComunicado() {
    try {
      const comunicados = await firstValueFrom(
        this.http.get<any[]>(`${API}/auditorias/${this.id}/comunicado`),
      );
      if (Array.isArray(comunicados) && comunicados.length) {
        this.comunicado = comunicados[comunicados.length - 1];
      }
    } catch {
      // comunicado pode não existir
    }
  }

  async salvar() {
    this.error = '';
    this.success = '';
    try {
      const result = await firstValueFrom(
        this.http.post(`${API}/auditorias`, {
          itemPlanoId: this.form.itemPlanoId,
          observacoes: this.form.observacoes || undefined,
          sigilosa: this.form.sigilosa,
        }),
      );
      this.success = 'Auditoria aberta com sucesso';
      this.router.navigate(['/auditorias', (result as any).id]);
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao abrir auditoria';
    }
  }

  async gerarComunicado() {
    this.error = '';
    this.gerando = true;
    try {
      this.comunicado = await firstValueFrom(
        this.http.post<any>(`${API}/auditorias/${this.id}/comunicado`, {}),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao gerar comunicado';
    } finally {
      this.gerando = false;
    }
  }

  statusColor(): string {
    const colorMap: Record<string, string> = {
      ABERTA: '#1565c0',
      EM_EXECUCAO: '#e65100',
      SUSPENSA: '#c62828',
      CONCLUIDA: '#2e7d32',
    };
    return colorMap[this.auditoria?.status] || '#666';
  }
}
