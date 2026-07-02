import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ToastService } from '../../core/services/toast.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { ValidationService } from '../../shared/services/validation.service';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatProgressSpinnerModule, MatIconModule,
    MatDividerModule, PageHeaderComponent,
  ],
  template: `
    <app-page-header
      [title]="isNew ? 'Novo Usuário' : 'Editar Usuário'"
      [breadcrumbs]="[
        { label: 'Usuários', route: '/usuarios' },
        { label: isNew ? 'Novo' : 'Editar' }
      ]"
    />

    <div class="max-w-3xl">
      <mat-card class="form-section">
        <mat-card-header class="form-section-header">
          <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
            <mat-icon class="text-primary">account_circle</mat-icon>
            Dados do Usuário
          </mat-card-title>
          <mat-card-subtitle class="text-xs text-text-sec">Preencha as informações funcionais para o cadastro.</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="form-section-content">
          @if (loading) {
            <div class="flex justify-center py-12">
              <mat-spinner diameter="40" />
            </div>
          } @else {
            <form (ngSubmit)="save()" #userForm="ngForm" class="flex flex-col gap-5">
              <div class="form-grid">
                <div class="form-grid-full">
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-icon matIconPrefix>badge</mat-icon>
                    <mat-label>Nome Completo</mat-label>
                    <input matInput [(ngModel)]="form.nome" name="nome" required #nomeModel="ngModel" placeholder="Ex: João da Silva" />
                    @if (nomeModel.invalid && nomeModel.touched) {
                      <mat-error>{{ validation.required('Nome completo') }}</mat-error>
                    }
                  </mat-form-field>
                </div>

                <div class="form-grid-full">
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-icon matIconPrefix>email</mat-icon>
                    <mat-label>E-mail Institucional</mat-label>
                    <input matInput type="email" [(ngModel)]="form.email" name="email" required #emailModel="ngModel" placeholder="Ex: joao.silva@tjce.gov.br" />
                    @if (emailModel.invalid && emailModel.touched) {
                      <mat-error>{{ validation.required('E-mail institucional') }}</mat-error>
                    }
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-icon matIconPrefix>confirmation_number</mat-icon>
                  <mat-label>Matrícula</mat-label>
                  <input matInput [(ngModel)]="form.matricula" name="matricula" required #matModel="ngModel" placeholder="Ex: 12345" />
                    @if (matModel.invalid && matModel.touched) {
                      <mat-error>{{ validation.required('Matrícula') }}</mat-error>
                    }
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-icon matIconPrefix>work</mat-icon>
                  <mat-label>Cargo</mat-label>
                  <input matInput [(ngModel)]="form.cargo" name="cargo" placeholder="Ex: Auditor Adjunto" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-icon matIconPrefix>business</mat-icon>
                  <mat-label>Unidade de Lotação</mat-label>
                  <input matInput [(ngModel)]="form.unidade" name="unidade" placeholder="Ex: AUDIN" />
                </mat-form-field>

                @if (isNew) {
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-icon matIconPrefix>lock</mat-icon>
                    <mat-label>Senha Inicial</mat-label>
                    <input matInput type="password" [(ngModel)]="form.senha" name="senha" required #senhaModel="ngModel" placeholder="Mínimo 6 caracteres" />
                    @if (senhaModel.invalid && senhaModel.touched) {
                      <mat-error>{{ validation.required('Senha inicial') }}</mat-error>
                    }
                  </mat-form-field>
                }
              </div>

              @if (saveError) {
                <div class="flex items-center gap-2 text-critical text-sm p-3 bg-critical-bg rounded-lg border border-critical/20" role="alert">
                  <mat-icon class="text-[18px]">error_outline</mat-icon>
                  <span>{{ saveError }}</span>
                </div>
              }

              <div class="form-actions">
                <button mat-stroked-button type="button" routerLink="/usuarios">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="saving || userForm.invalid" class="min-w-[140px]">
                  @if (saving) {
                    <mat-spinner diameter="18" class="inline-block mr-2" />
                  }
                  <mat-icon class="text-[18px] mr-1">check</mat-icon>
                  {{ isNew ? 'Cadastrar' : 'Salvar Alterações' }}
                </button>
              </div>
            </form>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class UsuarioFormComponent implements OnInit {
  isNew = true;
  loading = false;
  saving = false;
  saveError = '';
  form = { nome: '', email: '', matricula: '', cargo: '', unidade: '', senha: '' };
  private id = '';
  /** Referência ao ngForm para detecção de alterações não salvas (Epic D4). */
  @ViewChild('userForm') formRef?: NgForm;
  private saved = false;

  /** Guard de saída: bloqueia navegação se o formulário estiver "dirty" e não salvo. */
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
  }

  async load() {
    this.loading = true;
    try {
      const user = await firstValueFrom(
        this.http.get<any>(`${API}/usuarios/${this.id}`),
      );
      this.form = {
        nome: user.nome || '',
        email: user.email || '',
        matricula: user.matricula || '',
        cargo: user.cargo || '',
        unidade: user.unidade || '',
        senha: '',
      };
    } catch {
      this.saveError = 'Erro ao carregar usuário';
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
        await firstValueFrom(this.http.post(`${API}/usuarios`, this.form));
        this.toast.show('Usuário criado com sucesso', 'success');
        this.saved = true;
        await this.router.navigate(['/usuarios']);
      } else {
        await firstValueFrom(this.http.patch(`${API}/usuarios/${this.id}`, this.form));
        this.toast.show('Usuário atualizado com sucesso', 'success');
        // Edição permanece na página: marca o form como pristine para que uma
        // navegação posterior não dispare o guard (e uma re-edição volte a disparar).
        this.formRef?.resetForm(this.form);
      }
    } catch {
      this.saveError = 'Erro ao salvar usuário';
    } finally {
      this.saving = false;
    }
  }
}
