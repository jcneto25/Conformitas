import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { ValidationService } from '../../shared/services/validation.service';

@Component({
  selector: 'app-mfa',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatProgressSpinnerModule, MatIconModule,
  ],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center">
      <mat-card class="w-full max-w-md border-t-4 border-primary shadow-lg rounded-xl overflow-hidden">
        <mat-card-header class="bg-slate-50/50 px-6 py-5 border-b border-gray-100">
          <mat-card-title class="text-xl font-semibold text-text-main flex items-center gap-2">
            <mat-icon class="text-primary">security</mat-icon> Verificação MFA
          </mat-card-title>
          <mat-card-subtitle class="text-xs text-text-sec">Insira o código do seu autenticador</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="p-6">
          <form (ngSubmit)="onSubmit()" #mfaForm="ngForm" class="flex flex-col gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Código TOTP</mat-label>
              <input
                matInput
                type="text"
                [(ngModel)]="totp"
                name="totp"
                required
                minlength="6"
                maxlength="6"
                #totpModel="ngModel"
                inputmode="numeric"
                pattern="[0-9]{6}"
                placeholder="000000"
                class="text-center text-2xl tracking-[0.3em]" />
              @if (totpModel.invalid && totpModel.touched) {
                @if (totpModel.errors?.['required']) {
                  <mat-error>{{ validation.required('Código TOTP') }}</mat-error>
                } @else if (totpModel.errors?.['minlength'] || totpModel.errors?.['maxlength'] || totpModel.errors?.['pattern']) {
                  <mat-error>{{ validation.minlength('Código TOTP', 6) }}</mat-error>
                }
              }
            </mat-form-field>

            @if (error) {
              <div class="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100" role="alert">
                <mat-icon class="text-[18px]">error_outline</mat-icon>
                <span>{{ error }}</span>
              </div>
            }

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="w-full h-12"
              [disabled]="loading || mfaForm.invalid">
              @if (loading) {
                <mat-spinner diameter="20" class="inline-block mr-2" />
              }
              {{ loading ? 'Verificando...' : 'Verificar' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class MfaComponent {
  totp = '';
  error = '';
  loading = false;

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    public readonly validation: ValidationService,
  ) {}

  async onSubmit() {
    if (!this.totp || this.totp.length < 6 || this.loading) return;
    this.error = '';
    this.loading = true;

    const sessionToken = localStorage.getItem('session_token');
    if (!sessionToken) {
      this.error = 'Sessão expirada. Faça login novamente.';
      this.loading = false;
      return;
    }

    try {
      await this.auth.verifyMfa(sessionToken, this.totp);
      await this.router.navigate(['/']);
    } catch (err: any) {
      this.error = err?.error?.message || 'Código TOTP inválido';
    } finally {
      this.loading = false;
    }
  }
}
