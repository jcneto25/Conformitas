import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  mfa_required?: boolean;
  session_token?: string;
}

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a2e;">
      <div style="background: #fff; border-radius: 8px; padding: 2rem; width: 380px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
        <h2 style="text-align: center; margin: 0 0 0.25rem; color: #1a1a2e; font-family: sans-serif;">CONFORMITAS 3.0</h2>
        <p style="text-align: center; margin: 0 0 1.5rem; color: #666; font-size: 0.85rem; font-family: sans-serif;">SGI — AUDIN/TJCE</p>

        <form (ngSubmit)="onSubmit()" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; margin-bottom: 0.25rem; font-size: 0.85rem; font-weight: 500; font-family: sans-serif;">Email</label>
            <input type="email"
                   [(ngModel)]="email"
                   name="email"
                   required
                   style="width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 1rem;" />
          </div>

          <div>
            <label style="display: block; margin-bottom: 0.25rem; font-size: 0.85rem; font-weight: 500; font-family: sans-serif;">Senha</label>
            <input type="password"
                   [(ngModel)]="senha"
                   name="senha"
                   required
                   style="width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 1rem;" />
          </div>

          <p *ngIf="error" style="color: #c62828; font-size: 0.85rem; margin: 0; text-align: center; font-family: sans-serif;">{{ error }}</p>

          <button type="submit"
                  style="width: 100%; padding: 0.75rem; background: #1a1a2e; color: #fff; border: none; border-radius: 4px; font-size: 1rem; font-weight: 600; cursor: pointer; font-family: sans-serif;">
            Entrar
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  senha = '';
  error = '';

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
  ) {}

  async onSubmit() {
    if (!this.email || !this.senha) return;
    this.error = '';

    try {
      const res = await firstValueFrom(
        this.http.post<LoginResponse>(`${API}/auth/login`, {
          email: this.email,
          senha: this.senha,
        }),
      );

      if (res.access_token) {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        this.router.navigate(['/']);
      }
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao autenticar';
    }
  }
}
