import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a2e;">
      <mat-card style="width: 400px; padding: 2rem;">
        <mat-card-header style="justify-content: center;">
          <mat-card-title>CONFORMITAS 3.0</mat-card-title>
          <mat-card-subtitle>SGI — AUDIN/TJCE</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" required />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Senha</mat-label>
              <input matInput type="password" [(ngModel)]="senha" name="senha" required />
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit">Entrar</button>
          </form>
          <p style="text-align: center; margin-top: 1rem; font-size: 0.85rem; color: #666;">Autenticação pendente — PRP-001</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  senha = '';

  constructor(private readonly router: Router) {}

  onSubmit() {
    if (this.email && this.senha) {
      this.router.navigate(['/']);
    }
  }
}
