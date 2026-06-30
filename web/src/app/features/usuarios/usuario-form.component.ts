import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../core/services/toast.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatProgressSpinnerModule, MatIconModule, PageHeaderComponent,
  ],
  template: `
    <app-page-header [title]="isNew ? 'Novo Usuário' : 'Editar Usuário'" />

    <mat-card class="max-w-xl">
      <mat-card-content>
        @if (loading) {
          <div class="flex justify-center py-8">
            <mat-spinner diameter="40" />
          </div>
        } @else {
          <form (ngSubmit)="save()" #userForm="ngForm" class="flex flex-col gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Nome</mat-label>
              <input matInput [(ngModel)]="form.nome" name="nome" required #nomeModel="ngModel" />
              @if (nomeModel.invalid && nomeModel.touched) {
                <mat-error>Nome obrigatório</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="form.email" name="email" required #emailModel="ngModel" />
              @if (emailModel.invalid && emailModel.touched) {
                <mat-error>Email obrigatório</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Matrícula</mat-label>
              <input matInput [(ngModel)]="form.matricula" name="matricula" required #matModel="ngModel" />
              @if (matModel.invalid && matModel.touched) {
                <mat-error>Matrícula obrigatória</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Cargo</mat-label>
              <input matInput [(ngModel)]="form.cargo" name="cargo" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Unidade</mat-label>
              <input matInput [(ngModel)]="form.unidade" name="unidade" />
            </mat-form-field>

            @if (isNew) {
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Senha</mat-label>
                <input matInput type="password" [(ngModel)]="form.senha" name="senha" required #senhaModel="ngModel" />
                @if (senhaModel.invalid && senhaModel.touched) {
                  <mat-error>Senha obrigatória</mat-error>
                }
              </mat-form-field>
            }

            @if (saveError) {
              <div class="flex items-center gap-2 text-critical text-sm" role="alert">
                <mat-icon class="text-[18px]">error_outline</mat-icon>
                <span>{{ saveError }}</span>
              </div>
            }

            <div class="flex gap-2">
              <button mat-raised-button color="primary" type="submit" [disabled]="saving || userForm.invalid">
                @if (saving) {
                  <mat-spinner diameter="18" class="inline-block mr-1" />
                }
                {{ isNew ? 'Criar' : 'Salvar' }}
              </button>
              <button mat-button type="button" routerLink="/usuarios">Cancelar</button>
            </div>
          </form>
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class UsuarioFormComponent implements OnInit {
  isNew = true;
  loading = false;
  saving = false;
  saveError = '';
  form = { nome: '', email: '', matricula: '', cargo: '', unidade: '', senha: '' };
  private id = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly toast: ToastService,
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
        await this.router.navigate(['/usuarios']);
      } else {
        await firstValueFrom(this.http.patch(`${API}/usuarios/${this.id}`, this.form));
        this.toast.show('Usuário atualizado com sucesso', 'success');
      }
    } catch {
      this.saveError = 'Erro ao salvar usuário';
    } finally {
      this.saving = false;
    }
  }
}
