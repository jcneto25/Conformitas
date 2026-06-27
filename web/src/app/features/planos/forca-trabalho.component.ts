import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-forca-trabalho',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatProgressBarModule,
  ],
  template: `
    <mat-card>
      <mat-card-content>
        <h3>Força de Trabalho</h3>

        <!-- Indicadores visuais -->
        <div *ngIf="forcaTrabalho.length" style="margin-bottom: 1.5rem;">
          <div style="display: flex; gap: 2rem; flex-wrap: wrap; margin-bottom: 1rem;">
            <div style="flex: 1; min-width: 150px;">
              <div style="font-size: 2rem; font-weight: 700; color: #1565c0;">{{ totalDisponivel }}h</div>
              <div style="color: #666; font-size: 0.85rem;">Horas Disponíveis</div>
            </div>
            <div style="flex: 1; min-width: 150px;">
              <div style="font-size: 2rem; font-weight: 700;"
                   [style.color]="totalAlocado > totalDisponivel ? '#c62828' : '#2e7d32'">
                {{ totalAlocado }}h
              </div>
              <div style="color: #666; font-size: 0.85rem;">Horas Alocadas</div>
            </div>
            <div style="flex: 1; min-width: 150px;">
              <div style="font-size: 2rem; font-weight: 700;"
                   [style.color]="saldo < 0 ? '#c62828' : '#2e7d32'">
                {{ saldo }}h
              </div>
              <div style="color: #666; font-size: 0.85rem;">Saldo</div>
            </div>
          </div>

          <!-- Barra de progresso -->
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #888; margin-bottom: 0.25rem;">
              <span>0h</span>
              <span>{{ totalDisponivel }}h</span>
            </div>
            <mat-progress-bar mode="determinate" [value]="percentualAlocado"
                              [color]="percentualAlocado > 100 ? 'warn' : 'primary'">
            </mat-progress-bar>
            <div style="text-align: right; font-size: 0.75rem; margin-top: 0.25rem;"
                 [style.color]="percentualAlocado > 100 ? '#c62828' : '#666'">
              {{ percentualAlocado | number:'1.0-1' }}% alocado
            </div>
          </div>
        </div>

        <!-- Lista individual -->
        <div *ngFor="let ft of forcaTrabalho"
             style="display: flex; justify-content: space-between; align-items: center;
                    padding: 0.5rem 0; border-bottom: 1px solid #eee;">
          <div>
            <strong>{{ ft.usuario?.nome || ft.usuarioId }}</strong>
            <br /><small style="color: #888;">{{ ft.usuario?.email }}</small>
          </div>
          <div style="text-align: right;">
            <span style="font-weight: 600; color: #1565c0;">{{ ft.horasDisponiveisAno }}h</span>
            <br /><small style="color: #888;">Ano {{ ft.ano }}</small>
          </div>
        </div>

        <p *ngIf="!forcaTrabalho.length && !carregando" style="color: #999; padding: 1rem 0;">
          Nenhum registro de força de trabalho.
        </p>
        <mat-progress-bar *ngIf="carregando" mode="indeterminate" />

        <!-- Form adicionar -->
        <div *ngIf="planoId" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
          <h4>Adicionar Força de Trabalho</h4>
          <form (ngSubmit)="adicionar()" style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
            <mat-form-field appearance="outline" style="min-width: 250px;">
              <mat-label>Usuário</mat-label>
              <mat-select [(ngModel)]="form.usuarioId" name="usuarioId" required>
                @for (u of usuarios; track u.id) {
                  <mat-option [value]="u.id">{{ u.nome }} ({{ u.email }})</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" style="min-width: 150px;">
              <mat-label>Horas/Ano</mat-label>
              <input matInput type="number" [(ngModel)]="form.horasDisponiveisAno" name="horas"
                     required min="0" placeholder="2000" />
            </mat-form-field>

            <mat-form-field appearance="outline" style="min-width: 120px;">
              <mat-label>Ano</mat-label>
              <input matInput type="number" [(ngModel)]="form.ano" name="ano"
                     required [value]="anoAtual" />
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit"
                    [disabled]="!form.usuarioId || !form.horasDisponiveisAno">
              Adicionar
            </button>
          </form>
        </div>

        <p *ngIf="error" style="color: #c62828; margin-top: 0.5rem;">{{ error }}</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class ForcaTrabalhoComponent {
  @Input() planoId = '';
  @Input() forcaTrabalho: any[] = [];

  usuarios: any[] = [];
  carregando = false;
  error = '';
  anoAtual = new Date().getFullYear();
  form = { usuarioId: '', horasDisponiveisAno: 0, ano: this.anoAtual };

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    await Promise.all([this.carregarUsuarios()]);
  }

  async carregarUsuarios() {
    try {
      this.usuarios = await firstValueFrom(
        this.http.get<any[]>(`${API}/usuarios`),
      );
    } catch {
      // non-blocking
    }
  }

  get totalDisponivel(): number {
    return this.forcaTrabalho.reduce((s, f) => s + f.horasDisponiveisAno, 0);
  }

  get totalAlocado(): number {
    return this.forcaTrabalho.reduce(
      (s, f) => s + (f.horasAlocadasAuditoria || 0) + (f.horasAlocadasConsultoria || 0) + (f.horasAlocadasCapacitacao || 0),
      0,
    );
  }

  get saldo(): number {
    return this.totalDisponivel - this.totalAlocado;
  }

  get percentualAlocado(): number {
    if (this.totalDisponivel === 0) return 0;
    return Math.min((this.totalAlocado / this.totalDisponivel) * 100, 200);
  }

  async adicionar() {
    if (!this.form.usuarioId || !this.form.horasDisponiveisAno) return;
    this.error = '';
    try {
      const novo = await firstValueFrom(
        this.http.post(`${API}/forca-trabalho`, {
          planoId: this.planoId,
          usuarioId: this.form.usuarioId,
          horasDisponiveisAno: this.form.horasDisponiveisAno,
          ano: this.form.ano || this.anoAtual,
        }),
      );
      this.forcaTrabalho = [...this.forcaTrabalho, novo];
      this.form = { usuarioId: '', horasDisponiveisAno: 0, ano: this.anoAtual };
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao adicionar força de trabalho';
    }
  }
}
