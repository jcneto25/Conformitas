import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { ToastService } from '../../core/services/toast.service';
import { ValidationService } from '../../shared/services/validation.service';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

const API = environment.apiUrl;

@Component({
  selector: 'app-manifestacao-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, StatusBadgeComponent,
    PageHeaderComponent,
  ],
  template: `
    @if (loadError) {
      <mat-card class="border border-red-200 bg-red-50 rounded-xl shadow-sm">
        <mat-card-content class="flex items-center gap-2 text-red-600 p-4">
          <mat-icon>error_outline</mat-icon>
          <span class="text-sm">{{ loadError }}</span>
          <button mat-button color="primary" (click)="load()" class="ml-auto">Tentar novamente</button>
        </mat-card-content>
      </mat-card>
    } @else if (loading) {
      <div class="flex justify-center py-8"><mat-spinner diameter="40" /></div>
    } @else {
      <app-page-header title="Registrar Manifestação" [breadcrumbs]="[{label: 'Achados', route: '/achados'}, {label: achado?.codigo ?? ''}]" />

      @if (achado) {
        <mat-card class="mb-6 bg-blue-50 border border-blue-100 rounded-xl shadow-sm">
          <mat-card-content class="text-sm text-blue-700 p-4 flex items-center gap-2">
            <mat-icon class="text-[18px]">forum</mat-icon>
            Manifestação sobre o achado <strong class="mx-1">{{ achado.codigo }}</strong>
            <app-status-badge [status]="achado.status" />
          </mat-card-content>
        </mat-card>

        <mat-card class="border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
          <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
            <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
              <mat-icon class="text-primary">edit_note</mat-icon> Manifestação da Unidade Auditada
            </mat-card-title>
            <mat-card-subtitle class="text-xs text-text-sec">
              Registro da resposta da unidade ao achado (DIRAUD-Jud).
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="p-6">
            <form (ngSubmit)="save()" #manifestacaoForm="ngForm">
              <div class="flex flex-col gap-4">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Tipo de Manifestação</mat-label>
                  <mat-select [(ngModel)]="form.tipo" name="tipo" required #tipoModel="ngModel">
                    <mat-option value="ESCLARECIMENTO">Esclarecimento</mat-option>
                    <mat-option value="JUSTIFICATIVA">Justificativa</mat-option>
                    <mat-option value="CONCORDANCIA">Concordância</mat-option>
                    <mat-option value="DISCORDANCIA">Discordância</mat-option>
                  </mat-select>
                  @if (tipoModel.invalid && tipoModel.touched) {
                    <mat-error>{{ validation.required('Tipo de manifestação') }}</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Conteúdo da Manifestação</mat-label>
                  <textarea matInput [(ngModel)]="form.conteudo" name="conteudo" rows="6" required #conteudoModel="ngModel"></textarea>
                  @if (conteudoModel.invalid && conteudoModel.touched) {
                    <mat-error>{{ validation.required('Conteúdo da manifestação') }}</mat-error>
                  }
                </mat-form-field>

                @if (saveError) {
                  <div class="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100" role="alert">
                    <mat-icon class="text-[18px]">error_outline</mat-icon>
                    <span>{{ saveError }}</span>
                  </div>
                }
              </div>
              <div class="flex justify-between gap-2 pt-6">
                <button mat-stroked-button type="button" (click)="router.navigate(['/achados', id])">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="saving || manifestacaoForm.invalid" class="min-w-[160px]">
                  @if (saving) { <mat-spinner diameter="18" class="inline-block mr-2" /> }
                  Registrar Manifestação
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }
    }
  `,
})
export class ManifestacaoFormComponent implements OnInit {
  id = '';
  achado: any = null;
  loading = false;
  saving = false;
  loadError = '';
  saveError = '';
  form = { tipo: 'ESCLARECIMENTO', conteudo: '' };
  @ViewChild('manifestacaoForm') formRef?: NgForm;
  private saved = false;

  canDeactivate(): boolean {
    if (this.saved) return true;
    return !this.formRef?.dirty;
  }

  constructor(
    public readonly route: ActivatedRoute,
    public readonly router: Router,
    private readonly http: HttpClient,
    private readonly toast: ToastService,
    public readonly validation: ValidationService,
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (!this.id) {
      this.loadError = 'Achado não informado';
      return;
    }
    await this.load();
  }

  async load() {
    this.loading = true;
    this.loadError = '';
    try {
      this.achado = await firstValueFrom(this.http.get<any>(`${API}/achados/${this.id}`));
    } catch {
      this.loadError = 'Erro ao carregar achado';
    } finally {
      this.loading = false;
    }
  }

  async save() {
    if (this.saving) return;
    this.saving = true;
    this.saveError = '';
    try {
      await firstValueFrom(
        this.http.post(`${API}/achados/${this.id}/manifestacoes`, {
          tipo: this.form.tipo,
          conteudo: this.form.conteudo,
        }),
      );
      this.saved = true;
      this.toast.show('Manifestação registrada. Achado consolidado.', 'success');
      await this.router.navigate(['/achados', this.id]);
    } catch {
      this.saveError = 'Erro ao registrar manifestação';
    } finally {
      this.saving = false;
    }
  }
}
