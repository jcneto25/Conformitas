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

    <mat-card class="mb-4 border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
      <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
        <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
          <mat-icon class="text-primary">insights</mat-icon>
          Gerar Relatório
        </mat-card-title>
        <mat-card-subtitle class="text-xs text-text-sec">Consolida indicadores do exercício (P01).</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="p-6">
        <form class="flex flex-col gap-4">
          <div class="filter-bar gap-4 items-end">
            <mat-form-field appearance="outline" class="w-[160px]">
              <mat-label>Ano (exercício)</mat-label>
              <input matInput type="number" [(ngModel)]="ano" name="ano" placeholder="2025" />
            </mat-form-field>
            <button mat-raised-button color="primary" (click)="gerar()" [disabled]="!ano || carregando" class="flex items-center gap-2 min-w-[180px]">
              <mat-icon>insights</mat-icon>
              @if (carregando) { <mat-spinner diameter="18" class="inline-block" /> }
              Gerar Relatório Anual
            </button>
          </div>

          @if (erro) {
            <div class="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100 mt-2" role="alert">
              <mat-icon class="text-[18px]">error_outline</mat-icon>
              <span>{{ erro }}</span>
            </div>
          }
        </form>
      </mat-card-content>
    </mat-card>

    @if (carregando) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="40" />
      </div>
    }

    @if (resultado) {
      <mat-card class="border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
        <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
          <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
            <mat-icon class="text-primary">description</mat-icon>
            Relatório Anual {{ resultado.ano }}
          </mat-card-title>
          <mat-card-subtitle class="text-xs text-text-sec">Resultado consolidado do exercício.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="p-6">
          <mat-chip-set>
            <mat-chip [highlighted]="true" color="primary">{{ resultado.status }}</mat-chip>
          </mat-chip-set>
          <pre class="whitespace-pre-wrap bg-blue-50 border border-blue-100 text-text-main p-4 mt-3 rounded-lg">{{ resultado.conteudo }}</pre>
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
