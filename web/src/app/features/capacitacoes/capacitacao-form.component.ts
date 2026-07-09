import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ToastService } from '../../core/services/toast.service';
import { ValidationService } from '../../shared/services/validation.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

@Component({
  selector: 'app-capacitacao-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDatepickerModule, MatButtonModule,
    MatProgressSpinnerModule, MatIconModule, MatDividerModule,
    PageHeaderComponent,
  ],
  template: `
    <app-page-header
      [title]="isNew ? 'Nova Capacitação' : 'Editar Capacitação'"
     
    />

    <div class="max-w-3xl">
      <mat-card class="form-section">
        <mat-card-header class="form-section-header">
          <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
            <mat-icon class="text-primary">school</mat-icon>
            Dados da Capacitação
          </mat-card-title>
          <mat-card-subtitle class="text-xs text-text-sec">Preencha as informações da capacitação.</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="form-section-content">
          @if (loading) {
            <div class="flex justify-center py-12"><mat-spinner diameter="40" /></div>
          } @else {
            <form (ngSubmit)="save()" #formRef="ngForm" class="flex flex-col gap-5">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Título</mat-label>
                <input matInput [(ngModel)]="form.titulo" name="titulo" required #titModel="ngModel" placeholder="Ex: Auditoria Baseada em Risco" />
                @if (titModel.invalid && titModel.touched) {
                  <mat-error>{{ validation.required('Título') }}</mat-error>
                }
              </mat-form-field>

              <div class="form-grid">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Instituição</mat-label>
                  <input matInput [(ngModel)]="form.instituicao" name="instituicao" required placeholder="Ex: IIA Brasil" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Tipo</mat-label>
                  <mat-select [(ngModel)]="form.tipo" name="tipo" required>
                    <mat-option value="CURSO">Curso</mat-option>
                    <mat-option value="WORKSHOP">Workshop</mat-option>
                    <mat-option value="CONGRESSO">Congresso</mat-option>
                    <mat-option value="SEMINARIO">Seminário</mat-option>
                    <mat-option value="PALESTRA">Palestra</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="form-grid">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Carga Horária (h)</mat-label>
                  <input matInput type="number" [(ngModel)]="form.cargaHoraria" name="cargaHoraria" required min="1" placeholder="Ex: 40" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Data Início</mat-label>
                  <input matInput [matDatepicker]="pickerInicio" [(ngModel)]="form.dataInicio" name="dataInicio" required />
                  <mat-datepicker-toggle matIconSuffix [for]="pickerInicio" />
                  <mat-datepicker #pickerInicio />
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Data Fim</mat-label>
                  <input matInput [matDatepicker]="pickerFim" [(ngModel)]="form.dataFim" name="dataFim" required />
                  <mat-datepicker-toggle matIconSuffix [for]="pickerFim" />
                  <mat-datepicker #pickerFim />
                </mat-form-field>
              </div>

              @if (saveError) {
                <div class="flex items-center gap-2 text-critical text-sm p-3 bg-critical-bg rounded-lg border border-critical/20" role="alert">
                  <mat-icon class="text-[18px]">error_outline</mat-icon>
                  <span>{{ saveError }}</span>
                </div>
              }

              <div class="form-actions">
                <button mat-stroked-button type="button" routerLink="/capacitacoes">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="saving || formRef.invalid" class="min-w-[140px]">
                  @if (saving) { <mat-spinner diameter="18" class="inline-block mr-2" /> }
                  <mat-icon class="text-[18px] mr-1">check</mat-icon>
                  {{ isNew ? 'Criar Capacitação' : 'Salvar Alterações' }}
                </button>
              </div>
            </form>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class CapacitacaoFormComponent implements OnInit {
  isNew = true;
  loading = false;
  saving = false;
  saveError = '';
  form: any = {
    titulo: '',
    instituicao: '',
    tipo: '',
    cargaHoraria: 8,
    dataInicio: '',
    dataFim: '',
  };
  private id = '';
  @ViewChild('formRef') formRef?: NgForm;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly toast: ToastService,
    public readonly validation: ValidationService,
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.isNew = !this.id;
    if (!this.isNew) await this.load();
  }

  async load() {
    this.loading = true;
    try {
      const item = await firstValueFrom(this.http.get<any>(`${API}/capacitacoes/${this.id}`));
      Object.assign(this.form, item);
    } catch {
      this.saveError = 'Erro ao carregar capacitação';
    } finally {
      this.loading = false;
    }
  }

  async save() {
    if (this.saving) return;
    this.saving = true;
    this.saveError = '';
    try {
      if (this.isNew) {
        await firstValueFrom(this.http.post(`${API}/capacitacoes`, this.form));
        this.toast.show('Capacitação criada com sucesso', 'success');
        await this.router.navigate(['/capacitacoes']);
      } else {
        await firstValueFrom(this.http.patch(`${API}/capacitacoes/${this.id}`, this.form));
        this.toast.show('Capacitação atualizada com sucesso', 'success');
      }
    } catch {
      this.saveError = 'Erro ao salvar capacitação';
    } finally {
      this.saving = false;
    }
  }
}
