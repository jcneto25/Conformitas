import { Component, OnInit, inject } from '@angular/core';
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
  selector: 'app-determinacao-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,
    MatProgressSpinnerModule, MatCardModule,
  ],
  template: `
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-text-main mb-6">Nova Determinação Externa</h1>

      <mat-card class="!shadow-sm !rounded-lg">
        <mat-card-content class="p-6">
          <form #form="ngForm" (ngSubmit)="salvar()" class="flex flex-col gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Órgão</mat-label>
              <mat-select [(ngModel)]="dados.orgao" name="orgao" required>
                <mat-option value="TCE">TCE — Tribunal de Contas do Estado</mat-option>
                <mat-option value="CNJ">CNJ — Conselho Nacional de Justiça</mat-option>
                <mat-option value="OUTRO">Outro</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Número</mat-label>
              <input matInput [(ngModel)]="dados.numero" name="numero" required placeholder="Ex: 123/2026">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Descrição</mat-label>
              <textarea matInput [(ngModel)]="dados.descricao" name="descricao" required rows="3"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Prazo de Resposta (opcional)</mat-label>
              <input matInput [matDatepicker]="picker" [(ngModel)]="dados.prazoResposta" name="prazoResposta">
              <mat-datepicker-toggle matSuffix [for]="picker" />
              <mat-datepicker #picker />
            </mat-form-field>

            <div class="flex gap-3 justify-end mt-2">
              <button mat-stroked-button routerLink="/governanca" type="button">Cancelar</button>
              <button mat-flat-button color="primary" type="submit"
                      [disabled]="form.invalid || salvando">
                {{ salvando ? 'Salvando...' : 'Criar Determinação' }}
              </button>
            </div>
          </form>

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
export class DeterminacaoFormComponent {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  salvando = false;
  error = '';
  dados: any = {
    orgao: '',
    numero: '',
    descricao: '',
    prazoResposta: null,
  };

  async salvar() {
    this.salvando = true;
    this.error = '';
    try {
      const body: any = {
        orgao: this.dados.orgao,
        numero: this.dados.numero,
        descricao: this.dados.descricao,
      };
      if (this.dados.prazoResposta) {
        body.prazoResposta = this.dados.prazoResposta.toISOString().split('T')[0];
      }
      await firstValueFrom(this.http.post(`${environment.apiUrl}/determinacoes-externas`, body));
      await this.router.navigate(['/governanca']);
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao criar determinação';
    } finally {
      this.salvando = false;
    }
  }
}
