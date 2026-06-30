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

@Component({
  selector: 'app-mfa',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatProgressSpinnerModule, MatIconModule,
  ],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-background">
      <mat-card class="w-full max-w-sm p-8 shadow-lg rounded-lg">
        <mat-card-content>
          <div class="text-center mb-6">
            <mat-icon class="text-primary text-4xl w-auto h-auto">security</mat-icon>
            <h2 class="text-primary text-xl font-semibold mt-2 mb-1">Verificação MFA</h2>
            <p class="text-text-sec text-sm m-0">Insira o código do seu autenticador</p>
          </div>

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
                <mat-error>Código deve ter 6 dígitos</mat-error>
              }
            </mat-form-field>

            @if (error) {
              <div class="flex items-center gap-2 text-critical text-sm" role="alert">
                <mat-icon class="text-[18px]">error_outline</mat-icon>
                <span>{{ error }}</span>
              </div>
            }

            <button
              mat-flat-button
              color="primary"
              type="submit"
              class="w-full h-11"
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
