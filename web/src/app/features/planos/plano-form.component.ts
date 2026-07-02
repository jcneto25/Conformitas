import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { ValidationService } from '../../shared/services/validation.service';
import { ToastService } from '../../core/services/toast.service';
import { ForcaTrabalhoComponent } from './forca-trabalho.component';

@Component({
  selector: 'app-plano-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, MatInputModule,
    MatProgressSpinnerModule, MatDividerModule,
    PageHeaderComponent, StatusBadgeComponent, ForcaTrabalhoComponent,
  ],
  template: `
    <app-page-header [title]="isNew ? 'Novo Plano de Auditoria' : 'Editar Plano'" />

    <mat-card class="border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
      <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
        <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
          <mat-icon class="text-primary">assignment</mat-icon>
          {{ isNew ? 'Dados do Plano' : plano?.tipo + ' ' + plano?.anoInicio + '-' + plano?.anoFim }}
        </mat-card-title>
        @if (!isNew) {
          <mat-card-subtitle class="text-xs text-text-sec flex items-center gap-2">
            Versão {{ plano?.versao }}
            <app-status-badge [status]="plano?.status" />
          </mat-card-subtitle>
        }
      </mat-card-header>

      <mat-card-content class="p-6">
        @if (carregandoDados) {
          <div class="flex justify-center py-12">
            <mat-spinner diameter="40" />
          </div>
        } @else {
          <form #planoForm="ngForm" (ngSubmit)="salvar()">
            <div class="form-grid max-w-2xl">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Tipo de Plano</mat-label>
                <mat-select #tipoModel="ngModel" [(ngModel)]="model.tipo" name="tipo" required>
                  <mat-option value="PALP">PALP — Plano Anual de Longo Prazo</mat-option>
                  <mat-option value="PAA">PAA — Plano Anual de Auditoria</mat-option>
                </mat-select>
                @if (tipoModel.invalid && tipoModel.touched) {
                  <mat-error>{{ validation.required('Tipo') }}</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Ano Início</mat-label>
                <input matInput #anoInicioModel="ngModel" type="number" [(ngModel)]="model.anoInicio" name="anoInicio"
                       required min="2020" max="2099" placeholder="2025" />
                @if (anoInicioModel.invalid && anoInicioModel.touched) {
                  @if (anoInicioModel.errors?.['required']) {
                    <mat-error>{{ validation.required('Ano Início') }}</mat-error>
                  } @else if (anoInicioModel.errors?.['min'] || anoInicioModel.errors?.['max']) {
                    <mat-error>Ano inválido</mat-error>
                  }
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Ano Fim</mat-label>
                <input matInput #anoFimModel="ngModel" type="number" [(ngModel)]="model.anoFim" name="anoFim"
                       required min="2020" max="2099" placeholder="2028" />
                @if (anoFimModel.invalid && anoFimModel.touched) {
                  @if (anoFimModel.errors?.['required']) {
                    <mat-error>{{ validation.required('Ano Fim') }}</mat-error>
                  } @else if (anoFimModel.errors?.['min'] || anoFimModel.errors?.['max']) {
                    <mat-error>Ano inválido</mat-error>
                  }
                }
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="/planos">
                <mat-icon>arrow_back</mat-icon> Voltar
              </button>
              <button mat-raised-button color="primary" type="submit"
                      [disabled]="planoForm.invalid || salvando" class="flex items-center gap-2">
                @if (salvando) {
                  <mat-spinner diameter="18" />
                } @else {
                  <mat-icon>save</mat-icon>
                }
                {{ isNew ? 'Criar Plano' : 'Salvar' }}
              </button>
            </div>
          </form>

          @if (!isNew && plano) {
            <mat-divider class="my-6" />
            <app-forca-trabalho [planoId]="plano.id" [forcaTrabalho]="plano.forcaTrabalho || []" />
          }
        }
      </mat-card-content>
    </mat-card>

    @if (error) {
      <div class="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100 mt-4" role="alert">
        <mat-icon class="text-[18px]">error_outline</mat-icon>
        <span>{{ error }}</span>
      </div>
    }
  `,
})
export class PlanoFormComponent implements OnInit {
  @ViewChild('planoForm') formRef?: NgForm;

  isNew = true;
  plano: any = null;
  carregandoDados = false;
  salvando = false;
  error = '';

  model = {
    tipo: 'PAA' as string,
    anoInicio: new Date().getFullYear(),
    anoFim: new Date().getFullYear(),
  };

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly validation: ValidationService,
    private readonly toast: ToastService,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      await this.carregarPlano(id);
    }
  }

  private async carregarPlano(id: string) {
    this.carregandoDados = true;
    try {
      this.plano = await firstValueFrom(
        this.http.get(`${environment.apiUrl}/planos/${id}`),
      );
      this.model.tipo = this.plano.tipo;
      this.model.anoInicio = this.plano.anoInicio;
      this.model.anoFim = this.plano.anoFim;
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar plano';
    } finally {
      this.carregandoDados = false;
    }
  }

  async salvar() {
    if (this.formRef?.invalid) return;
    this.salvando = true;
    this.error = '';
    try {
      if (this.isNew) {
        await firstValueFrom(
          this.http.post(`${environment.apiUrl}/planos`, this.model),
        );
        this.toast.show('Plano criado com sucesso', 'success');
        await this.router.navigate(['/planos']);
      } else {
        await firstValueFrom(
          this.http.patch(`${environment.apiUrl}/planos/${this.plano.id}`, this.model),
        );
        this.toast.show('Plano atualizado com sucesso', 'success');
        await this.carregarPlano(this.plano.id);
      }
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao salvar plano';
    } finally {
      this.salvando = false;
    }
  }
}
