import { Component, OnInit, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-qualidade-avaliacao-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,
    MatProgressSpinnerModule, MatCardModule,
  ],
  template: `
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-text-main mb-6">
        {{ isEdit ? 'Editar Avaliação' : 'Nova Avaliação de Qualidade' }}
      </h1>

      <mat-card class="!shadow-sm !rounded-lg">
        <mat-card-content class="p-6">
          @if (loading && isEdit) {
            <div class="flex justify-center py-8"><mat-spinner diameter="40" /></div>
          } @else {
            <form #form="ngForm" (ngSubmit)="salvar()" class="flex flex-col gap-4">
              <mat-form-field appearance="outline">
                <mat-label>Tipo</mat-label>
                <mat-select [(ngModel)]="dados.tipo" name="tipo" required>
                  <mat-option value="MONITORAMENTO">Monitoramento Contínuo</mat-option>
                  <mat-option value="AUTOAVALIACAO">Autoavaliação Periódica</mat-option>
                  <mat-option value="EXTERNA">Avaliação Externa</mat-option>
                </mat-select>
              </mat-form-field>

              <div class="grid grid-cols-2 gap-4">
                <mat-form-field appearance="outline">
                  <mat-label>Início do Período</mat-label>
                  <input matInput [matDatepicker]="pickerInicio" [(ngModel)]="dados.periodoInicio"
                         name="periodoInicio" required>
                  <mat-datepicker-toggle matSuffix [for]="pickerInicio" />
                  <mat-datepicker #pickerInicio />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Fim do Período</mat-label>
                  <input matInput [matDatepicker]="pickerFim" [(ngModel)]="dados.periodoFim"
                         name="periodoFim" required>
                  <mat-datepicker-toggle matSuffix [for]="pickerFim" />
                  <mat-datepicker #pickerFim />
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline">
                <mat-label>Resultado (opcional)</mat-label>
                <textarea matInput [(ngModel)]="dados.resultado" name="resultado" rows="3"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nota (0–10, opcional)</mat-label>
                <input matInput type="number" min="0" max="10" step="0.1"
                       [(ngModel)]="dados.nota" name="nota">
              </mat-form-field>

              <div class="flex gap-3 justify-end mt-2">
                <button mat-stroked-button routerLink="/qualidade" type="button">Cancelar</button>
                <button mat-flat-button color="primary" type="submit"
                        [disabled]="form.invalid || salvando">
                  {{ salvando ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar Avaliação') }}
                </button>
              </div>
            </form>
          }

          @if (error) {
            <div class="flex items-center gap-2 text-red-600 text-sm mt-4 p-3 bg-red-50 rounded-lg border border-red-100" role="alert">
              <span>{{ error }}</span>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class QualidadeAvaliacaoFormComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly id = input<string>();

  isEdit = false;
  loading = false;
  salvando = false;
  error = '';
  dados: any = {
    tipo: '',
    periodoInicio: null,
    periodoFim: null,
    resultado: '',
    nota: null,
  };

  async ngOnInit() {
    if (this.id()) {
      this.isEdit = true;
      await this.carregar();
    }
  }

  async carregar() {
    this.loading = true;
    try {
      const a = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/qualidade/avaliacoes/${this.id()}`));
      this.dados = {
        tipo: a.tipo,
        periodoInicio: new Date(a.periodoInicio),
        periodoFim: new Date(a.periodoFim),
        resultado: a.resultado || '',
        nota: a.nota,
      };
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar avaliação';
    } finally {
      this.loading = false;
    }
  }

  async salvar() {
    this.salvando = true;
    this.error = '';
    try {
      const body = {
        tipo: this.dados.tipo,
        periodoInicio: this.dados.periodoInicio?.toISOString().split('T')[0],
        periodoFim: this.dados.periodoFim?.toISOString().split('T')[0],
        resultado: this.dados.resultado || undefined,
        nota: this.dados.nota != null ? Number(this.dados.nota) : undefined,
      };

      if (this.isEdit) {
        await firstValueFrom(this.http.put(`${environment.apiUrl}/qualidade/avaliacoes/${this.id()}`, body));
      } else {
        await firstValueFrom(this.http.post(`${environment.apiUrl}/qualidade/avaliacoes`, body));
      }
      await this.router.navigate(['/qualidade']);
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao salvar avaliação';
    } finally {
      this.salvando = false;
    }
  }
}
