import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';
import { HasRoleDirective } from '../../core/directives/has-role.directive';
import { ValidationService } from '../../shared/services/validation.service';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-usuario-perfil-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, MatDialogModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatButtonModule, MatListModule, MatIconModule, MatDividerModule,
    MatProgressSpinnerModule, PageHeaderComponent, SkeletonComponent, HasRoleDirective, EmptyStateComponent,
  ],
  template: `
    <app-page-header title="Perfis do Usuário" />

    @if (loading) {
      <div class="flex justify-center py-8"><app-skeleton type="card" /></div>
    } @else {
      @if (usuario) {
        <mat-card class="mb-4 border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
          <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
            <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
              <mat-icon class="text-primary">account_circle</mat-icon>
              {{ usuario.nome }}
            </mat-card-title>
            <mat-card-subtitle class="text-xs text-text-sec">Dados funcionais do usuário.</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="p-6">
            <p class="text-text-sec"><strong class="text-text-main">Email:</strong> {{ usuario.email }}</p>
            <p class="text-text-sec"><strong class="text-text-main">Matrícula:</strong> {{ usuario.matricula }}</p>
          </mat-card-content>
        </mat-card>
      }

      <mat-card class="mb-4 border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
        <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
          <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
            <mat-icon class="text-primary">verified_user</mat-icon>
            Perfis Atribuídos
          </mat-card-title>
          <mat-card-subtitle class="text-xs text-text-sec">Papéis e escopos atualmente vinculados ao usuário.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="p-6">
          @if (perfisUsuario.length) {
            <mat-list>
              @for (up of perfisUsuario; track up.id) {
                <mat-list-item>
                  <span matListItemTitle class="text-sm font-medium text-text-main">
                    <strong>{{ up.perfil?.codigo }}</strong> — {{ up.perfil?.nome }}
                  </span>
                  @if (up.unidadeEscopo) {
                    <span matListItemLine class="text-text-sec">
                      Escopo: {{ up.unidadeEscopo }}
                    </span>
                  }
                  <button mat-icon-button matListItemMeta color="warn"
                          (click)="removerPerfil(up.id)" title="Remover perfil" aria-label="Remover perfil" *appHasRole="'P10'">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-list-item>
                <mat-divider />
              }
            </mat-list>
          } @else {
            <app-empty-state icon="assignment_ind" title="Nenhum perfil atribuído" description="Atribua perfis ao usuário para definir suas permissões no sistema." size="sm" />
          }
        </mat-card-content>
      </mat-card>

      <mat-card class="border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
        <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
          <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
            <mat-icon class="text-primary">person_add</mat-icon>
            Atribuir Perfil
          </mat-card-title>
          <mat-card-subtitle class="text-xs text-text-sec">Selecione um perfil e, opcionalmente, um escopo de unidade.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="p-6">
          <form (ngSubmit)="atribuir()" #perfilForm="ngForm" class="flex flex-col gap-4">
            <div class="form-grid gap-x-4 gap-y-1">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Perfil</mat-label>
                <mat-select #perfilModel="ngModel" [(ngModel)]="perfilSelecionado" name="perfil" required>
                  @for (p of perfisDisponiveis; track p.id) {
                    <mat-option [value]="p.id">
                      {{ p.codigo }} — {{ p.nome }}
                    </mat-option>
                  }
                </mat-select>
                @if (perfilModel.invalid && perfilModel.touched) {
                  <mat-error>{{ validation.required('Perfil') }}</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Unidade (escopo opcional)</mat-label>
                <input matInput [(ngModel)]="unidadeEscopo" name="unidade" placeholder="Ex: 1ª Vara Cível" />
              </mat-form-field>
            </div>

            @if (success) {
              <div class="flex items-center gap-2 text-green-700 text-sm p-3 bg-green-50 rounded-lg border border-green-100 mt-2">
                <mat-icon class="text-[18px]">check_circle</mat-icon>
                <span>{{ success }}</span>
              </div>
            }
            @if (error) {
              <div class="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100 mt-2" role="alert">
                <mat-icon class="text-[18px]">error_outline</mat-icon>
                <span>{{ error }}</span>
              </div>
            }

            <div class="form-actions mt-2">
              <button mat-raised-button color="primary" type="submit"
                      [disabled]="!perfilSelecionado" *appHasRole="'P10'" class="min-w-[120px]">
                Atribuir
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    }

    @if (loadError) {
      <p class="text-red-600 text-center mt-4">{{ loadError }}</p>
    }
  `,
})
export class UsuarioPerfilFormComponent implements OnInit {
  usuario: any = null;
  perfisUsuario: any[] = [];
  perfisDisponiveis: any[] = [];
  perfilSelecionado = '';
  unidadeEscopo = '';
  error = '';
  success = '';
  loadError = '';
  loading = true;
  private usuarioId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
    public readonly validation: ValidationService,
  ) {}

  async ngOnInit() {
    this.usuarioId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.usuarioId) {
      this.router.navigate(['/usuarios']);
      return;
    }
    await Promise.all([this.loadUsuario(), this.loadPerfisUsuario(), this.loadPerfis()]);
  }

  async loadUsuario() {
    try {
      this.usuario = await firstValueFrom(
        this.http.get<any>(`${environment.apiUrl}/usuarios/${this.usuarioId}`),
      );
    } catch (err: any) {
      this.loadError = 'Erro ao carregar usuário';
    }
  }

  async loadPerfisUsuario() {
    try {
      this.perfisUsuario = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/usuarios/${this.usuarioId}/perfis`),
      );
    } catch (err: any) {
      this.loadError = 'Erro ao carregar perfis do usuário';
    }
  }

  async loadPerfis() {
    try {
      this.perfisDisponiveis = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/perfis`),
      );
    } catch (err: any) {
      // non-blocking
    } finally {
      this.loading = false;
    }
  }

  async atribuir() {
    if (!this.perfilSelecionado) return;
    this.error = '';
    this.success = '';
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/usuarios/${this.usuarioId}/perfis`, {
          perfil_id: this.perfilSelecionado,
          unidade_escopo: this.unidadeEscopo || undefined,
        }),
      );
      this.success = 'Perfil atribuído com sucesso';
      this.perfilSelecionado = '';
      this.unidadeEscopo = '';
      await this.loadPerfisUsuario();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao atribuir perfil';
    }
  }

  async removerPerfil(usuarioPerfilId: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar', message: 'Remover perfil do usuário?', confirmText: 'Sim', cancelText: 'Não', type: 'danger' } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    this.error = '';
    try {
      await firstValueFrom(
        this.http.delete(`${environment.apiUrl}/usuarios-perfis/${usuarioPerfilId}`),
      );
      await this.loadPerfisUsuario();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao remover perfil';
    }
  }
}
