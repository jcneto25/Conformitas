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
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { ValidationService } from '../../shared/services/validation.service';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-forca-trabalho',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatProgressBarModule, MatProgressSpinnerModule,
    MatIconModule, EmptyStateComponent,
  ],
  template: `
    <mat-card class="border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
      <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
        <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
          <mat-icon class="text-primary">groups</mat-icon>
          Força de Trabalho
        </mat-card-title>
        <mat-card-subtitle class="text-xs text-text-sec">Distribuição de horas disponíveis e alocadas da equipe.</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="p-6">

        @if (carregando) {
          <div class="flex justify-center py-12">
            <mat-spinner diameter="40" />
          </div>
        }

        @if (forcaTrabalho.length) {
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <mat-card class="border-t-4 border-primary shadow-sm rounded-xl">
              <mat-card-content class="p-5">
                <div class="text-3xl font-bold text-blue-700">{{ totalDisponivel }}h</div>
                <div class="text-text-sec text-sm mt-1">Horas Disponíveis</div>
              </mat-card-content>
            </mat-card>

            <mat-card class="border-t-4 border-primary shadow-sm rounded-xl">
              <mat-card-content class="p-5">
                <div class="text-3xl font-bold"
                     [class.text-red-600]="totalAlocado > totalDisponivel"
                     [class.text-green-700]="totalAlocado <= totalDisponivel">
                  {{ totalAlocado }}h
                </div>
                <div class="text-text-sec text-sm mt-1">Horas Alocadas</div>
              </mat-card-content>
            </mat-card>

            <mat-card class="border-t-4 border-primary shadow-sm rounded-xl">
              <mat-card-content class="p-5">
                <div class="text-3xl font-bold"
                     [class.text-red-600]="saldo < 0"
                     [class.text-green-700]="saldo >= 0">
                  {{ saldo }}h
                </div>
                <div class="text-text-sec text-sm mt-1">Saldo</div>
              </mat-card-content>
            </mat-card>
          </div>

          <div class="mb-6">
            <div class="flex justify-between text-sm text-text-sec mb-1">
              <span>0h</span>
              <span>{{ totalDisponivel }}h</span>
            </div>
            <mat-progress-bar mode="determinate" [value]="percentualAlocado"
                              [color]="percentualAlocado > 100 ? 'warn' : 'primary'" />
            <div class="text-right text-xs mt-1"
                 [class.text-red-600]="percentualAlocado > 100"
                 [class.text-text-sec]="percentualAlocado <= 100">
              {{ percentualAlocado | number:'1.0-1' }}% alocado
            </div>
          </div>

          <div class="shadow-sm rounded-xl overflow-hidden border border-gray-100 bg-white">
            @for (ft of forcaTrabalho; track $index) {
              <div class="flex justify-between items-center py-3 px-4 border-b border-gray-100 last:border-b-0">
                <div>
                  <div class="text-sm font-semibold text-text-main">{{ ft.usuario?.nome || ft.usuarioId }}</div>
                  <div class="text-xs text-text-sec mt-0.5">{{ ft.usuario?.email }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-semibold text-blue-700">{{ ft.horasDisponiveisAno }}h</div>
                  <div class="text-xs text-text-sec mt-0.5">Ano {{ ft.ano }}</div>
                </div>
              </div>
            }
          </div>
        } @else if (!carregando) {
          <app-empty-state icon="groups" title="Nenhum registro de força de trabalho" description="Adicione usuários à força de trabalho para distribuir horas disponíveis." size="sm" />
        }

        @if (planoId) {
          <div class="mt-6 pt-4 border-t border-gray-100">
            <h4 class="text-base font-semibold text-text-main mb-3 flex items-center gap-2">
              <mat-icon class="text-primary text-[20px]">person_add</mat-icon>
              Adicionar Força de Trabalho
            </h4>
            <form (ngSubmit)="adicionar()" class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1 items-start">
              <mat-form-field appearance="outline" class="w-full">
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

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Horas/Ano</mat-label>
                <input matInput #horasModel="ngModel" type="number" [(ngModel)]="form.horasDisponiveisAno" name="horas"
                       required min="0" placeholder="2000" />
                @if (horasModel.invalid && horasModel.touched) {
                  @if (horasModel.errors?.['required']) {
                    <mat-error>{{ validation.required('Horas/ano') }}</mat-error>
                  } @else if (horasModel.errors?.['min']) {
                    <mat-error>{{ validation.min('Horas/ano', 0) }}</mat-error>
                  }
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Ano</mat-label>
                <input matInput #anoModel="ngModel" type="number" [(ngModel)]="form.ano" name="ano"
                       required [value]="anoAtual" />
                @if (anoModel.invalid && anoModel.touched) {
                  <mat-error>{{ validation.required('Ano') }}</mat-error>
                }
              </mat-form-field>

              <div class="md:col-span-3 flex items-center gap-3 mt-2">
                <button mat-raised-button color="primary" type="submit"
                        [disabled]="!form.usuarioId || !form.horasDisponiveisAno"
                        class="flex items-center gap-2">
                  <mat-icon>add</mat-icon>
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        }

        @if (error) {
          <div class="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100 mt-2" role="alert">
            <mat-icon class="text-[18px]">error_outline</mat-icon>
            <span>{{ error }}</span>
          </div>
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

  constructor(
    private readonly http: HttpClient,
    public readonly validation: ValidationService,
  ) {}

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
