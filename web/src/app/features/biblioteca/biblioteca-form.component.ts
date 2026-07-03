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
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { ToastService } from '../../core/services/toast.service';
import { ValidationService } from '../../shared/services/validation.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

@Component({
  selector: 'app-biblioteca-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatProgressSpinnerModule,
    MatIconModule, MatDividerModule, MatChipsModule,
    PageHeaderComponent,
  ],
  template: `
    <app-page-header
      [title]="isNew ? 'Novo Documento' : 'Editar Documento'"
      [breadcrumbs]="[
        { label: 'Biblioteca', route: '/biblioteca' },
        { label: isNew ? 'Novo' : 'Editar' }
      ]"
    />

    <div class="max-w-3xl">
      <mat-card class="form-section">
        <mat-card-header class="form-section-header">
          <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
            <mat-icon class="text-primary">description</mat-icon>
            Dados do Documento
          </mat-card-title>
          <mat-card-subtitle class="text-xs text-text-sec">Preencha as informações do documento metodológico.</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="form-section-content">
          @if (loading) {
            <div class="flex justify-center py-12"><mat-spinner diameter="40" /></div>
          } @else {
            <form (ngSubmit)="save()" #formRef="ngForm" class="flex flex-col gap-5">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Título</mat-label>
                <input matInput [(ngModel)]="form.titulo" name="titulo" required #titModel="ngModel" placeholder="Ex: Manual de Auditoria Interna" />
                @if (titModel.invalid && titModel.touched) {
                  <mat-error>{{ validation.required('Título') }}</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Descrição</mat-label>
                <textarea matInput [(ngModel)]="form.descricao" name="descricao" rows="2" placeholder="Descrição do documento..."></textarea>
              </mat-form-field>

              <div class="form-grid">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Categoria</mat-label>
                  <mat-select [(ngModel)]="form.categoria" name="categoria" required>
                    <mat-option value="MANUAL">Manual</mat-option>
                    <mat-option value="PROGRAMA">Programa</mat-option>
                    <mat-option value="GUIA">Guia</mat-option>
                    <mat-option value="POLITICA">Política</mat-option>
                    <mat-option value="FORMULARIO">Formulário</mat-option>
                  </mat-select>
                </mat-form-field>

                @if (!isNew) {
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Status</mat-label>
                    <mat-select [(ngModel)]="form.status" name="status">
                      <mat-option value="RASCUNHO">Rascunho</mat-option>
                      <mat-option value="PUBLICADO">Publicado</mat-option>
                      <mat-option value="ARQUIVADO">Arquivado</mat-option>
                    </mat-select>
                  </mat-form-field>
                }
              </div>

              @if (!isNew) {
                <div class="bg-primary/5 rounded-lg p-3 flex items-center gap-3">
                  <mat-icon class="text-primary">tag</mat-icon>
                  <span class="text-sm text-text-sec">Versão atual: <strong>v{{ form.versao || '1.0' }}</strong></span>
                  <span class="text-xs text-text-sec">— Nova versão será gerada automaticamente ao salvar.</span>
                </div>
              }

              @if (saveError) {
                <div class="flex items-center gap-2 text-critical text-sm p-3 bg-critical-bg rounded-lg border border-critical/20" role="alert">
                  <mat-icon class="text-[18px]">error_outline</mat-icon>
                  <span>{{ saveError }}</span>
                </div>
              }

              <div class="form-actions">
                <button mat-stroked-button type="button" routerLink="/biblioteca">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="saving || formRef.invalid" class="min-w-[140px]">
                  @if (saving) { <mat-spinner diameter="18" class="inline-block mr-2" /> }
                  <mat-icon class="text-[18px] mr-1">check</mat-icon>
                  {{ isNew ? 'Criar Documento' : 'Salvar Alterações' }}
                </button>
              </div>
            </form>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class BibliotecaFormComponent implements OnInit {
  isNew = true;
  loading = false;
  saving = false;
  saveError = '';
  form: any = {
    titulo: '',
    descricao: '',
    categoria: '',
    status: 'RASCUNHO',
    versao: '1.0',
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
      const item = await firstValueFrom(this.http.get<any>(`${API}/documentos-metodologicos/${this.id}`));
      Object.assign(this.form, item);
    } catch {
      this.saveError = 'Erro ao carregar documento';
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
        await firstValueFrom(this.http.post(`${API}/documentos-metodologicos`, this.form));
        this.toast.show('Documento criado com sucesso', 'success');
        await this.router.navigate(['/biblioteca']);
      } else {
        await firstValueFrom(this.http.patch(`${API}/documentos-metodologicos/${this.id}`, this.form));
        this.toast.show('Documento atualizado com sucesso', 'success');
      }
    } catch {
      this.saveError = 'Erro ao salvar documento';
    } finally {
      this.saving = false;
    }
  }
}
