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
import { ToastService } from '../../core/services/toast.service';
import { ValidationService } from '../../shared/services/validation.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

@Component({
  selector: 'app-risco-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatProgressSpinnerModule,
    MatIconModule, MatDividerModule, PageHeaderComponent,
  ],
  template: `
    <app-page-header
      [title]="isNew ? 'Novo Risco' : 'Editar Risco'"
      [breadcrumbs]="[
        { label: 'Gestão de Riscos', route: '/riscos' },
        { label: isNew ? 'Novo' : 'Editar' }
      ]"
    />

    <div class="max-w-3xl">
      <mat-card class="form-section">
        <mat-card-header class="form-section-header">
          <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
            <mat-icon class="text-primary">gpp_maybe</mat-icon>
            Dados do Risco
          </mat-card-title>
          <mat-card-subtitle class="text-xs text-text-sec">Preencha as informações do risco.</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="form-section-content">
          @if (loading) {
            <div class="flex justify-center py-12"><mat-spinner diameter="40" /></div>
          } @else {
            <form (ngSubmit)="save()" #formRef="ngForm" class="flex flex-col gap-5">
              <div class="form-grid">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Código</mat-label>
                  <input matInput [(ngModel)]="form.codigo" name="codigo" required #codModel="ngModel" placeholder="Ex: RISCO-001" />
                  @if (codModel.invalid && codModel.touched) {
                    <mat-error>{{ validation.required('Código') }}</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Categoria</mat-label>
                  <mat-select [(ngModel)]="form.categoria" name="categoria" required #catModel="ngModel">
                    <mat-option value="OPERACIONAL">Operacional</mat-option>
                    <mat-option value="FINANCEIRO">Financeiro</mat-option>
                    <mat-option value="COMPLIANCE">Compliance</mat-option>
                    <mat-option value="IMAGEM">Imagem</mat-option>
                    <mat-option value="ESTRATEGICO">Estratégico</mat-option>
                  </mat-select>
                  @if (catModel.invalid && catModel.touched) {
                    <mat-error>{{ validation.required('Categoria') }}</mat-error>
                  }
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Descrição</mat-label>
                <textarea matInput [(ngModel)]="form.descricao" name="descricao" required rows="2" placeholder="Ex: Perda de auditores experientes por aposentadoria"></textarea>
              </mat-form-field>

              <div class="form-grid">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Causa</mat-label>
                  <input matInput [(ngModel)]="form.causa" name="causa" placeholder="Ex: Quadro reduzido de auditores efetivos" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Evento</mat-label>
                  <input matInput [(ngModel)]="form.evento" name="evento" placeholder="Ex: Saída de auditor sênior" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Consequência</mat-label>
                  <input matInput [(ngModel)]="form.consequencia" name="consequencia" placeholder="Ex: Redução da capacidade de execução" />
                </mat-form-field>
              </div>

              <mat-divider />

              <div class="form-grid">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Probabilidade (1-5)</mat-label>
                  <input matInput type="number" [(ngModel)]="form.probabilidade" name="probabilidade" required min="1" max="5" #probModel="ngModel" (input)="calcularNivel()" />
                  @if (probModel.invalid && probModel.touched) {
                    <mat-error>{{ validation.min('Probabilidade', 1) }}</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Impacto (1-5)</mat-label>
                  <input matInput type="number" [(ngModel)]="form.impacto" name="impacto" required min="1" max="5" #impModel="ngModel" (input)="calcularNivel()" />
                  @if (impModel.invalid && impModel.touched) {
                    <mat-error>{{ validation.min('Impacto', 1) }}</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Estratégia</mat-label>
                  <mat-select [(ngModel)]="form.estrategia" name="estrategia">
                    <mat-option value="MITIGAR">Mitigar</mat-option>
                    <mat-option value="ACEITAR">Aceitar</mat-option>
                    <mat-option value="TRANSFERIR">Transferir</mat-option>
                    <mat-option value="EVITAR">Evitar</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Plano de Ação</mat-label>
                <textarea matInput [(ngModel)]="form.plano_acao" name="plano_acao" rows="2" placeholder="Ex: Programa de retenção e plano de sucessão"></textarea>
              </mat-form-field>

              <div class="bg-primary/5 rounded-lg p-4 flex items-center gap-4">
                <mat-icon class="text-primary">assessment</mat-icon>
                <div>
                  <span class="text-sm text-text-sec">Nível de Risco:</span>
                  <span class="ml-2 text-lg font-bold"
                    [class.text-green-600]="nivelCalculado === 'BAIXO'"
                    [class.text-yellow-600]="nivelCalculado === 'MEDIO'"
                    [class.text-orange-600]="nivelCalculado === 'ALTO'"
                    [class.text-red-600]="nivelCalculado === 'CRITICO'"
                    [class.text-purple-600]="nivelCalculado === 'EXTREMO'">
                    {{ nivelCalculado }}
                  </span>
                  <span class="ml-3 text-sm text-text-sec">(Score: {{ form.probabilidade * form.impacto }})</span>
                </div>
              </div>

              @if (saveError) {
                <div class="flex items-center gap-2 text-critical text-sm p-3 bg-critical-bg rounded-lg border border-critical/20" role="alert">
                  <mat-icon class="text-[18px]">error_outline</mat-icon>
                  <span>{{ saveError }}</span>
                </div>
              }

              <div class="form-actions">
                <button mat-stroked-button type="button" routerLink="/riscos">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="saving || formRef.invalid" class="min-w-[140px]">
                  @if (saving) { <mat-spinner diameter="18" class="inline-block mr-2" /> }
                  <mat-icon class="text-[18px] mr-1">check</mat-icon>
                  {{ isNew ? 'Criar Risco' : 'Salvar Alterações' }}
                </button>
              </div>
            </form>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class RiscoFormComponent implements OnInit {
  isNew = true;
  loading = false;
  saving = false;
  saveError = '';
  nivelCalculado = 'BAIXO';
  form: any = {
    codigo: '',
    descricao: '',
    categoria: '',
    causa: '',
    evento: '',
    consequencia: '',
    probabilidade: 3,
    impacto: 3,
    nivel: '',
    estrategia: '',
    plano_acao: '',
    status: 'ATIVO',
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
    this.calcularNivel();
  }

  calcularNivel() {
    const score = (this.form.probabilidade || 1) * (this.form.impacto || 1);
    if (score <= 5) this.nivelCalculado = 'BAIXO';
    else if (score <= 10) this.nivelCalculado = 'MEDIO';
    else if (score <= 15) this.nivelCalculado = 'ALTO';
    else if (score <= 20) this.nivelCalculado = 'CRITICO';
    else this.nivelCalculado = 'EXTREMO';
    this.form.nivel = this.nivelCalculado;
  }

  async load() {
    this.loading = true;
    try {
      const item = await firstValueFrom(this.http.get<any>(`${API}/riscos/${this.id}`));
      Object.assign(this.form, item);
      this.calcularNivel();
    } catch {
      this.saveError = 'Erro ao carregar risco';
    } finally {
      this.loading = false;
    }
  }

  async save() {
    if (this.saving) return;
    this.saving = true;
    this.saveError = '';
    try {
      const payload = { ...this.form };
      if (this.isNew) {
        await firstValueFrom(this.http.post(`${API}/riscos`, payload));
        this.toast.show('Risco criado com sucesso', 'success');
        await this.router.navigate(['/riscos']);
      } else {
        await firstValueFrom(this.http.patch(`${API}/riscos/${this.id}`, payload));
        this.toast.show('Risco atualizado com sucesso', 'success');
      }
    } catch {
      this.saveError = 'Erro ao salvar risco';
    } finally {
      this.saving = false;
    }
  }
}
