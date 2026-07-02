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
import { AuthService } from '../../../core/services/auth.service';
import { ValidationService } from '../../../shared/services/validation.service';

@Component({
  selector: 'app-login',
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
            <mat-icon class="text-primary">lock</mat-icon> Conformitas
          </mat-card-title>
          <mat-card-subtitle class="text-xs text-text-sec">SGI — AUDIN/TJCE</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="p-6">
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="flex flex-col gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                email
                #emailModel="ngModel"
                autocomplete="username"
                placeholder="seu@email.com" />
              @if (emailModel.invalid && emailModel.touched) {
                <mat-error>{{ validation.required('E-mail') }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Senha</mat-label>
              <input
                matInput
                type="password"
                [(ngModel)]="senha"
                name="senha"
                required
                #senhaModel="ngModel"
                autocomplete="current-password" />
              @if (senhaModel.invalid && senhaModel.touched) {
                <mat-error>{{ validation.required('Senha') }}</mat-error>
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
              [disabled]="loading || loginForm.invalid">
              @if (loading) {
                <mat-spinner diameter="20" class="inline-block mr-2" />
              }
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  senha = '';
  error = '';
  loading = false;

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    public readonly validation: ValidationService,
  ) {}

  async onSubmit() {
    if (!this.email || !this.senha || this.loading) return;
    this.error = '';
    this.loading = true;

    try {
      const res = await this.auth.login(this.email, this.senha);
      if (res.mfa_required) {
        localStorage.setItem('session_token', res.session_token!);
        await this.router.navigate(['/mfa']);
      } else {
        await this.router.navigate(['/']);
      }
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao autenticar';
    } finally {
      this.loading = false;
    }
  }
}
