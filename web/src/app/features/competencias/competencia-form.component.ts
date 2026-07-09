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
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../core/services/toast.service';
import { ValidationService } from '../../shared/services/validation.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

@Component({
  selector: 'app-competencia-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatProgressSpinnerModule,
    MatIconModule, PageHeaderComponent,
  ],
  template: `
    <app-page-header
      [title]="isNew ? 'Nova Competência' : 'Editar Competência'"
     
    />

    <div class="max-w-3xl">
      <mat-card class="form-section">
        <mat-card-header class="form-section-header">
          <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
            <mat-icon class="text-primary">psychology</mat-icon>
            Dados da Competência
          </mat-card-title>
          <mat-card-subtitle class="text-xs text-text-sec">Preencha as informações da competência.</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="form-section-content">
          @if (loading) {
            <div class="flex justify-center py-12"><mat-spinner diameter="40" /></div>
          } @else {
            <form (ngSubmit)="save()" #formRef="ngForm" class="flex flex-col gap-5">
              <div class="form-grid">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Código</mat-label>
                  <input matInput [(ngModel)]="form.codigo" name="codigo" required #codModel="ngModel" placeholder="Ex: COMP-001" />
                  @if (codModel.invalid && codModel.touched) {
                    <mat-error>{{ validation.required('Código') }}</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Categoria</mat-label>
                  <mat-select [(ngModel)]="form.categoria" name="categoria" required>
                    <mat-option value="TECNICA">Técnica</mat-option>
                    <mat-option value="GOVERNAMENTAL">Governamental</mat-option>
                    <mat-option value="ETICA">Ética</mat-option>
                    <mat-option value="GERENCIAL">Gerencial</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Nome</mat-label>
                <input matInput [(ngModel)]="form.nome" name="nome" required placeholder="Ex: Auditoria Baseada em Risco (RBIA)" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Descrição</mat-label>
                <textarea matInput [(ngModel)]="form.descricao" name="descricao" rows="2" placeholder="Descrição da competência..."></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nível Esperado</mat-label>
                <mat-select [(ngModel)]="form.nivelEsperado" name="nivelEsperado" required>
                  <mat-option value="BASICO">Básico</mat-option>
                  <mat-option value="INTERMEDIARIO">Intermediário</mat-option>
                  <mat-option value="AVANCADO">Avançado</mat-option>
                  <mat-option value="ESPECIALISTA">Especialista</mat-option>
                </mat-select>
              </mat-form-field>

              @if (saveError) {
                <div class="flex items-center gap-2 text-critical text-sm p-3 bg-critical-bg rounded-lg border border-critical/20" role="alert">
                  <mat-icon class="text-[18px]">error_outline</mat-icon>
                  <span>{{ saveError }}</span>
                </div>
              }

              <div class="form-actions">
                <button mat-stroked-button type="button" routerLink="/competencias">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="saving || formRef.invalid" class="min-w-[140px]">
                  @if (saving) { <mat-spinner diameter="18" class="inline-block mr-2" /> }
                  <mat-icon class="text-[18px] mr-1">check</mat-icon>
                  {{ isNew ? 'Criar Competência' : 'Salvar Alterações' }}
                </button>
              </div>
            </form>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class CompetenciaFormComponent implements OnInit {
  isNew = true;
  loading = false;
  saving = false;
  saveError = '';
  form: any = {
    codigo: '',
    nome: '',
    descricao: '',
    categoria: '',
    nivelEsperado: '',
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
      const item = await firstValueFrom(this.http.get<any>(`${API}/competencias/${this.id}`));
      Object.assign(this.form, item);
    } catch {
      this.saveError = 'Erro ao carregar competência';
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
        await firstValueFrom(this.http.post(`${API}/competencias`, this.form));
        this.toast.show('Competência criada com sucesso', 'success');
        await this.router.navigate(['/competencias']);
      } else {
        await firstValueFrom(this.http.patch(`${API}/competencias/${this.id}`, this.form));
        this.toast.show('Competência atualizada com sucesso', 'success');
      }
    } catch {
      this.saveError = 'Erro ao salvar competência';
    } finally {
      this.saving = false;
    }
  }
}
