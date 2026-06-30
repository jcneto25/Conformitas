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

@Component({
  selector: 'app-login',
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
            <h1 class="text-primary text-2xl font-bold m-0">CONFORMITAS 3.0</h1>
            <p class="text-text-sec text-sm mt-1 mb-0">SGI — AUDIN/TJCE</p>
          </div>

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
                <mat-error>Email obrigatório</mat-error>
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
                <mat-error>Senha obrigatória</mat-error>
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
