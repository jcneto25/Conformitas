import { Component, OnInit, ViewChild, computed, signal } from '@angular/core';
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
import { ToastService } from '../../core/services/toast.service';
import { ValidationService } from '../../shared/services/validation.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

@Component({
  selector: 'app-universo-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatProgressSpinnerModule,
    MatIconModule, MatDividerModule, PageHeaderComponent,
  ],
  template: `
    <app-page-header
      [title]="isNew ? 'Novo Item do Universo' : 'Editar Item do Universo'"
      [breadcrumbs]="[
        { label: 'Universo Auditável', route: '/universo' },
        { label: isNew ? 'Novo' : 'Editar' }
      ]"
    />

    <div class="max-w-3xl">
      <mat-card class="form-section">
        <mat-card-header class="form-section-header">
          <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
            <mat-icon class="text-primary">account_tree</mat-icon>
            Dados do Item
          </mat-card-title>
          <mat-card-subtitle class="text-xs text-text-sec">Preencha as informações do universo auditável.</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="form-section-content">
          @if (loading) {
            <div class="flex justify-center py-12">
              <mat-spinner diameter="40" />
            </div>
          } @else {
            <form (ngSubmit)="save()" #universoForm="ngForm" class="flex flex-col gap-5">
              <div class="form-grid">
                <div class="form-grid-full">
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-icon matIconPrefix>badge</mat-icon>
                    <mat-label>Nome do Item</mat-label>
                    <input matInput [(ngModel)]="form.nome" name="nome" required #nomeModel="ngModel" placeholder="Ex: Secretaria de Finanças" />
                    @if (nomeModel.invalid && nomeModel.touched) {
                      <mat-error>{{ validation.required('Nome') }}</mat-error>
                    }
                  </mat-form-field>
                </div>

                <div class="form-grid-full">
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-icon matIconPrefix>description</mat-icon>
                    <mat-label>Descrição</mat-label>
                    <textarea matInput [(ngModel)]="form.descricao" name="descricao" rows="2" placeholder="Ex: Gestão orçamentária, financeira e contábil"></textarea>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-icon matIconPrefix>category</mat-icon>
                  <mat-label>Tipo</mat-label>
                  <mat-select [(ngModel)]="form.tipo" name="tipo" required #tipoModel="ngModel">
                    <mat-option value="AREA">Área</mat-option>
                    <mat-option value="PROCESSO">Processo</mat-option>
                    <mat-option value="TEMA">Tema</mat-option>
                    <mat-option value="PROJETO">Projeto</mat-option>
                  </mat-select>
                  @if (tipoModel.invalid && tipoModel.touched) {
                    <mat-error>{{ validation.required('Tipo') }}</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-icon matIconPrefix>business</mat-icon>
                  <mat-label>Unidade Responsável</mat-label>
                  <input matInput [(ngModel)]="form.unidadeResponsavel" name="unidade" required #undModel="ngModel" placeholder="Ex: SEFIN" />
                  @if (undModel.invalid && undModel.touched) {
                    <mat-error>{{ validation.required('Unidade responsável') }}</mat-error>
                  }
                </mat-form-field>
              </div>

              <mat-divider />

              <div class="form-grid">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-icon matIconPrefix>looks_one</mat-icon>
                  <mat-label>Materialidade (1-5)</mat-label>
                  <input matInput type="number" [(ngModel)]="form.materialidade" name="materialidade" required min="1" max="5" #matModel="ngModel" (input)="recalcular()" />
                  @if (matModel.invalid && matModel.touched) {
                    <mat-error>{{ matModel.errors?.['min'] ? validation.min('Materialidade', 1) : validation.required('Materialidade') }}</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-icon matIconPrefix>looks_two</mat-icon>
                  <mat-label>Relevância (1-5)</mat-label>
                  <input matInput type="number" [(ngModel)]="form.relevancia" name="relevancia" required min="1" max="5" #revModel="ngModel" (input)="recalcular()" />
                  @if (revModel.invalid && revModel.touched) {
                    <mat-error>{{ revModel.errors?.['min'] ? validation.min('Relevância', 1) : validation.required('Relevância') }}</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-icon matIconPrefix>looks_3</mat-icon>
                  <mat-label>Criticidade (1-5)</mat-label>
                  <input matInput type="number" [(ngModel)]="form.criticidade" name="criticidade" required min="1" max="5" #critModel="ngModel" (input)="recalcular()" />
                  @if (critModel.invalid && critModel.touched) {
                    <mat-error>{{ critModel.errors?.['min'] ? validation.min('Criticidade', 1) : validation.required('Criticidade') }}</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-icon matIconPrefix>looks_4</mat-icon>
                  <mat-label>Risco (1-5)</mat-label>
                  <input matInput type="number" [(ngModel)]="form.risco" name="risco" required min="1" max="5" #riscoModel="ngModel" (input)="recalcular()" />
                  @if (riscoModel.invalid && riscoModel.touched) {
                    <mat-error>{{ riscoModel.errors?.['min'] ? validation.min('Risco', 1) : validation.required('Risco') }}</mat-error>
                  }
                </mat-form-field>
              </div>

              <div class="bg-primary/5 rounded-lg p-4 flex items-center gap-4">
                <mat-icon class="text-primary">calculate</mat-icon>
                <div>
                  <span class="text-sm text-text-sec">Índice de Priorização:</span>
                  <span class="ml-2 text-xl font-bold text-primary-dark">{{ indiceCalculado() | number:'1.2-2' }}</span>
                </div>
              </div>

              @if (saveError) {
                <div class="flex items-center gap-2 text-critical text-sm p-3 bg-critical-bg rounded-lg border border-critical/20" role="alert">
                  <mat-icon class="text-[18px]">error_outline</mat-icon>
                  <span>{{ saveError }}</span>
                </div>
              }

              <div class="form-actions">
                <button mat-stroked-button type="button" routerLink="/universo">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="saving || universoForm.invalid" class="min-w-[140px]">
                  @if (saving) {
                    <mat-spinner diameter="18" class="inline-block mr-2" />
                  }
                  <mat-icon class="text-[18px] mr-1">check</mat-icon>
                  {{ isNew ? 'Criar Item' : 'Salvar Alterações' }}
                </button>
              </div>
            </form>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class UniversoFormComponent implements OnInit {
  isNew = true;
  loading = false;
  saving = false;
  saveError = '';
  form = {
    nome: '',
    descricao: '',
    tipo: '',
    unidadeResponsavel: '',
    materialidade: 5,
    relevancia: 4,
    criticidade: 4,
    risco: 3,
  };
  private id = '';
  @ViewChild('universoForm') formRef?: NgForm;
  private saved = false;

  readonly m = signal(5);
  readonly r = signal(4);
  readonly c = signal(4);
  readonly risco = signal(3);

  readonly indiceCalculado = computed(() => {
    return Math.round(Math.pow(this.m() * this.r() * this.c() * this.risco(), 1 / 4) * 100) / 100;
  });

  canDeactivate(): boolean {
    if (this.saved) return true;
    return !this.formRef?.dirty;
  }

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
    this.atualizarSignals();
  }

  private atualizarSignals() {
    this.m.set(this.form.materialidade);
    this.r.set(this.form.relevancia);
    this.c.set(this.form.criticidade);
    this.risco.set(this.form.risco);
  }

  recalcular() {
    this.atualizarSignals();
  }

  async load() {
    this.loading = true;
    try {
      const item = await firstValueFrom(
        this.http.get<any>(`${API}/universo-auditavel/${this.id}`),
      );
      this.form = {
        nome: item.nome || '',
        descricao: item.descricao || '',
        tipo: item.tipo || '',
        unidadeResponsavel: item.unidadeResponsavel || '',
        materialidade: item.materialidade ?? 5,
        relevancia: item.relevancia ?? 4,
        criticidade: item.criticidade ?? 4,
        risco: item.risco ?? 3,
      };
      this.atualizarSignals();
    } catch {
      this.saveError = 'Erro ao carregar item do universo';
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
        await firstValueFrom(this.http.post(`${API}/universo-auditavel`, this.form));
        this.toast.show('Item criado com sucesso', 'success');
        this.saved = true;
        await this.router.navigate(['/universo']);
      } else {
        await firstValueFrom(this.http.patch(`${API}/universo-auditavel/${this.id}`, this.form));
        this.toast.show('Item atualizado com sucesso', 'success');
        this.formRef?.resetForm(this.form);
      }
    } catch {
      this.saveError = 'Erro ao salvar item do universo';
    } finally {
      this.saving = false;
    }
  }
}
