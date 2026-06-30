import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-classificacao-selector',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatChipsModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="flex gap-4 items-end flex-wrap">
      @if (loading) {
        <mat-spinner diameter="24" />
      } @else {
        @if (classificacaoAtual) {
          <mat-chip [class]="'text-white ' + nivelColor(classificacaoAtual.nivelSigilo)">
            {{ classificacaoAtual.nivelSigilo }}
          </mat-chip>
        } @else {
          <span class="text-text-sec text-sm">Não classificado</span>
        }

        <mat-form-field appearance="outline" class="min-w-[180px]">
          <mat-label>Nível de Sigilo</mat-label>
          <mat-select [(ngModel)]="nivelSelecionado" name="nivelSigilo" required>
            <mat-option value="PUBLICO">Público</mat-option>
            <mat-option value="INTERNO">Interno</mat-option>
            <mat-option value="RESTRITO">Restrito</mat-option>
            <mat-option value="SIGILOSO">Sigiloso</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="min-w-[250px]">
          <mat-label>Justificativa (opcional)</mat-label>
          <input matInput [(ngModel)]="justificativa" name="justificativa" />
        </mat-form-field>

        <button mat-stroked-button color="primary" (click)="classificar()"
                [disabled]="!nivelSelecionado || classificando">
          {{ classificando ? 'Classificando...' : 'Classificar' }}
        </button>

        @if (classificacaoAtual) {
          <button mat-button (click)="carregar()" class="ml-2">
            Recarregar
          </button>
        }
      }
    </div>
    @if (error) {
      <p class="text-critical mt-1 text-sm">{{ error }}</p>
    }
  `,
})
export class ClassificacaoSelectorComponent implements OnInit {
  @Input() entidadeTipo = '';
  @Input() entidadeId = '';
  @Output() classificacaoChange = new EventEmitter<any>();

  classificacaoAtual: any = null;
  nivelSelecionado = '';
  justificativa = '';
  classificando = false;
  error = '';
  loading = true;

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    if (!this.entidadeTipo || !this.entidadeId) return;
    this.loading = true;
    try {
      this.classificacaoAtual = await firstValueFrom(
        this.http.get<any>(`${environment.apiUrl}/etica/${this.entidadeTipo}/${this.entidadeId}/classificacao`),
      );
    } catch {
      this.classificacaoAtual = null;
    } finally {
      this.loading = false;
    }
  }

  async classificar() {
    if (!this.nivelSelecionado) return;
    this.error = '';
    this.classificando = true;
    try {
      this.classificacaoAtual = await firstValueFrom(
        this.http.put(`${environment.apiUrl}/etica/${this.entidadeTipo}/${this.entidadeId}/classificacao`, {
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
      PUBLICO: 'bg-green-600',
      INTERNO: 'bg-blue-600',
      RESTRITO: 'bg-orange-600',
      SIGILOSO: 'bg-red-600',
    };
    return m[nivel] || 'bg-gray-500';
  }
}
