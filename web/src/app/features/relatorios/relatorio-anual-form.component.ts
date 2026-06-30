import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-relatorio-anual-form',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, PageHeaderComponent,
  ],
  template: `
    <app-page-header title="Relatório Anual de Atividades" />

    <mat-card class="mb-4">
      <mat-card-content>
        <div class="flex gap-4 items-center flex-wrap">
          <mat-form-field appearance="outline" class="w-[160px]">
            <mat-label>Ano (exercício)</mat-label>
            <input matInput type="number" [(ngModel)]="ano" name="ano" placeholder="2025" />
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="gerar()" [disabled]="!ano || carregando">
            <mat-icon>insights</mat-icon> Gerar Relatório Anual
          </button>
          <span class="text-text-sec text-sm">Consolida indicadores do exercício (P01).</span>
        </div>
        @if (erro) {
          <p class="text-critical mt-2">{{ erro }}</p>
        }
      </mat-card-content>
    </mat-card>

    @if (carregando) {
      <div class="flex justify-center p-8">
        <mat-spinner diameter="40" />
      </div>
    }

    @if (resultado) {
      <mat-card>
        <mat-card-header>
          <mat-card-title>Relatório Anual {{ resultado.ano }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-chip-set>
            <mat-chip [highlighted]="true" color="primary">{{ resultado.status }}</mat-chip>
          </mat-chip-set>
          <pre class="whitespace-pre-wrap bg-background p-3 mt-3 rounded">{{ resultado.conteudo }}</pre>
        </mat-card-content>
      </mat-card>
    }
  `,
})
export class RelatorioAnualFormComponent {
  ano: number | null = new Date().getFullYear();
  resultado: any = null;
  erro = '';
  carregando = false;

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
  ) {}

  async gerar() {
    this.erro = '';
    this.resultado = null;
    if (!this.ano) return;
    this.carregando = true;
    try {
      this.resultado = await firstValueFrom(
        this.http.post<any>(`${environment.apiUrl}/relatorios-anuais`, {
          ano: this.ano,
          autorId: this.auth.user()?.id || '',
        }),
      );
    } catch (e: any) {
      this.erro = e?.error?.message || 'Erro ao gerar relatório anual (já existe para o ano?)';
    } finally {
      this.carregando = false;
    }
  }
}
