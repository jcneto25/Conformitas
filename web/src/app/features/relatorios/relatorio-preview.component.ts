import { Component } from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { HasRoleDirective } from '../../core/directives/has-role.directive';
import { AuthService } from '../../core/services/auth.service';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-relatorio-preview',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatChipsModule,
    MatIconModule, MatDividerModule, MatProgressSpinnerModule, PageHeaderComponent, HasRoleDirective, EmptyStateComponent,
  ],
  template: `
    <app-page-header title="Relatórios de Auditoria" />

    <!-- Card de busca por auditoria -->
    <mat-card class="border-l-4 border-primary shadow-sm rounded-r-xl overflow-hidden">
      <mat-card-content class="p-4 bg-slate-50/30">
        <div class="filter-bar gap-4 items-center">
          <mat-form-field appearance="outline" class="flex-1 min-w-[240px]">
            <mat-label>ID da Auditoria</mat-label>
            <input matInput [(ngModel)]="auditoriaId" name="auditoriaId" placeholder="uuid da auditoria" />
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="carregar()" [disabled]="!auditoriaId" class="h-[48px] flex items-center gap-2 px-5">
            <mat-icon>search</mat-icon> Carregar
          </button>
        </div>
      </mat-card-content>
    </mat-card>

    <!-- Card de geração de relatório -->
    <mat-card class="mt-6 border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
      <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
        <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
          <mat-icon class="text-primary">picture_as_pdf</mat-icon>
          Gerar Relatório
        </mat-card-title>
        <mat-card-subtitle class="text-xs text-text-sec">Compile os achados da auditoria em um relatório.</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="p-6">
        <div class="filter-bar gap-4 items-center">
          <mat-form-field appearance="outline" class="w-[220px]">
            <mat-label>Tipo</mat-label>
            <mat-select [(ngModel)]="gerarTipo" name="tipo">
              <mat-option value="PRELIMINAR">Preliminar</mat-option>
              <mat-option value="FINAL">Final</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="accent" (click)="gerar()" [disabled]="!auditoriaId" class="flex items-center gap-2">
            <mat-icon>picture_as_pdf</mat-icon> Gerar
          </button>
          <span class="text-text-sec text-sm">
            Preliminar compila achados PRELIMINAR; Final exige todos CONSOLIDADO.
          </span>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-divider />

    @if (carregando) {
      <div class="flex justify-center py-8">
        <mat-spinner diameter="40" />
      </div>
    }

    @if (relatorios.length > 0) {
      <h2 class="text-lg font-semibold text-text-main mt-6 mb-2">Relatórios ({{ relatorios.length }})</h2>
    }

    @for (r of relatorios; track r.id) {
      <mat-card class="mt-4 border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
        <mat-card-content class="p-6">
          <div class="flex justify-between items-center flex-wrap">
            <div>
              <mat-chip-set>
                <mat-chip>{{ r.tipo }}</mat-chip>
                <mat-chip [highlighted]="r.status === 'ASSINADO'" color="primary">{{ r.status }}</mat-chip>
              </mat-chip-set>
              @if (r.dataEmissao) {
                <p class="text-text-sec mt-2 mb-0">{{ r.dataEmissao | date:'short' }}</p>
              }
            </div>
            <div class="flex gap-2">
              <button mat-stroked-button (click)="baixarPdf(r.id)" class="flex items-center gap-1">
                <mat-icon>download</mat-icon> PDF
              </button>
              @if (r.status === 'RASCUNHO') {
                <button mat-raised-button color="primary" (click)="assinar(r.id)" *appHasRole="'P01'" class="flex items-center gap-1">
                  <mat-icon>draw</mat-icon> Assinar (P01)
                </button>
              }
            </div>
          </div>
          <pre class="whitespace-pre-wrap bg-slate-50 border border-gray-100 text-text-main p-3 mt-3 rounded-lg text-sm">{{ preview(r.conteudo) }}</pre>
        </mat-card-content>
      </mat-card>
    } @empty {
      @if (auditoriaId && !carregando) {
        <app-empty-state icon="description" title="Nenhum relatório para esta auditoria" description="O relatório será gerado após a consolidação dos achados." size="sm" />
      }
    }

    @if (error) {
      <mat-card class="mt-4 border border-red-200 bg-red-50 rounded-xl shadow-sm">
        <mat-card-content class="flex items-center gap-2 text-red-600 p-4">
          <mat-icon>error_outline</mat-icon>
          <span class="text-sm">{{ error }}</span>
        </mat-card-content>
      </mat-card>
    }
  `,
})
export class RelatorioPreviewComponent {
  auditoriaId = '';
  relatorios: any[] = [];
  gerarTipo: 'PRELIMINAR' | 'FINAL' = 'PRELIMINAR';
  carregando = false;
  error = '';

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
  ) {}

  async carregar() {
    if (!this.auditoriaId) return;
    this.carregando = true;
    this.error = '';
    try {
      this.relatorios = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/relatorios`, { params: { auditoriaId: this.auditoriaId } }),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar relatórios';
    } finally {
      this.carregando = false;
    }
  }

  async gerar() {
    if (!this.auditoriaId) return;
    this.error = '';
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auditorias/${this.auditoriaId}/relatorios`, {
          tipo: this.gerarTipo,
          autorId: this.auth.user()?.id || '',
        }),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao gerar relatório';
    }
    await this.carregar();
  }

  async assinar(id: string) {
    this.error = '';
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/relatorios/${id}/assinar`, { userId: this.auth.user()?.id || '' }),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao assinar relatório';
    }
    await this.carregar();
  }

  baixarPdf(id: string) {
    window.open(`${environment.apiUrl}/relatorios/${id}/pdf`, '_blank');
  }

  preview(conteudo: string): string {
    return (conteudo || '').slice(0, 300);
  }
}
