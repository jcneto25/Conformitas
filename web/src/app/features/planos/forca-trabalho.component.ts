import { Component, Input, OnInit } from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forca-trabalho',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatProgressBarModule, MatProgressSpinnerModule,
  ],
  template: `
    <mat-card>
      <mat-card-content>
        <h3>Força de Trabalho</h3>

        @if (carregando) {
          <div class="flex justify-center p-8">
            <mat-spinner diameter="40" />
          </div>
        }

        @if (forcaTrabalho.length) {
          <div class="mb-6">
            <div class="flex gap-8 flex-wrap mb-4">
              <div class="flex-1 min-w-[150px]">
                <div class="text-3xl font-bold text-info">{{ totalDisponivel }}h</div>
                <div class="text-text-sec text-sm">Horas Disponíveis</div>
              </div>
              <div class="flex-1 min-w-[150px]">
                <div class="text-3xl font-bold"
                     [class.text-critical]="totalAlocado > totalDisponivel"
                     [class.text-success]="totalAlocado <= totalDisponivel">
                  {{ totalAlocado }}h
                </div>
                <div class="text-text-sec text-sm">Horas Alocadas</div>
              </div>
              <div class="flex-1 min-w-[150px]">
                <div class="text-3xl font-bold"
                     [class.text-critical]="saldo < 0"
                     [class.text-success]="saldo >= 0">
                  {{ saldo }}h
                </div>
                <div class="text-text-sec text-sm">Saldo</div>
              </div>
            </div>

            <div class="mb-4">
              <div class="flex justify-between text-sm text-text-sec mb-1">
                <span>0h</span>
                <span>{{ totalDisponivel }}h</span>
              </div>
              <mat-progress-bar mode="determinate" [value]="percentualAlocado"
                                [color]="percentualAlocado > 100 ? 'warn' : 'primary'" />
              <div class="text-right text-xs mt-1"
                   [class.text-critical]="percentualAlocado > 100"
                   [class.text-text-sec]="percentualAlocado <= 100">
                {{ percentualAlocado | number:'1.0-1' }}% alocado
              </div>
            </div>
          </div>

          @for (ft of forcaTrabalho; track $index) {
            <div class="flex justify-between items-center py-2 border-b border-divider">
              <div>
                <strong>{{ ft.usuario?.nome || ft.usuarioId }}</strong>
                <br /><small class="text-text-sec">{{ ft.usuario?.email }}</small>
              </div>
              <div class="text-right">
                <span class="font-semibold text-info">{{ ft.horasDisponiveisAno }}h</span>
                <br /><small class="text-text-sec">Ano {{ ft.ano }}</small>
              </div>
            </div>
          }
        } @else if (!carregando) {
          <p class="text-text-sec py-4">Nenhum registro de força de trabalho.</p>
        }

        @if (planoId) {
          <div class="mt-4 pt-4 border-t border-divider">
            <h4>Adicionar Força de Trabalho</h4>
            <form (ngSubmit)="adicionar()" class="flex gap-4 items-end flex-wrap">
              <mat-form-field appearance="outline" class="min-w-[250px]">
                <mat-label>Usuário</mat-label>
                <mat-select #usuarioModel="ngModel" [(ngModel)]="form.usuarioId" name="usuarioId" required>
                  @for (u of usuarios; track u.id) {
                    <mat-option [value]="u.id">{{ u.nome }} ({{ u.email }})</mat-option>
                  }
                </mat-select>
                @if (usuarioModel.invalid && usuarioModel.touched) {
                  <mat-error>Selecione um usuário</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="min-w-[150px]">
                <mat-label>Horas/Ano</mat-label>
                <input matInput type="number" [(ngModel)]="form.horasDisponiveisAno" name="horas"
                       required min="0" placeholder="2000" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="min-w-[120px]">
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
        }

        @if (error) {
          <p class="text-critical mt-2">{{ error }}</p>
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class ForcaTrabalhoComponent implements OnInit {
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
    this.carregando = true;
    try {
      this.usuarios = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/usuarios`),
      );
    } catch {
      // non-blocking
    } finally {
      this.carregando = false;
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
        this.http.post(`${environment.apiUrl}/forca-trabalho`, {
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
